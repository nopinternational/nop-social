import { GetObjectCommand, PutObjectCommand, UploadPartCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { env } from "~/env.mjs";

const contentLengthMaxSize = 1500000;

export const imageRouter = createTRPCRouter({
  getUploadPresignedUrl: protectedProcedure
    .input(z.object({ key: z.string(), contentLength: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { key } = input;
      const { s3, prisma } = ctx;

      if (input.contentLength > contentLengthMaxSize) {
        throw new Error(`Content length is too large. Max size is ${contentLengthMaxSize}`);
      }

      const newImage = await prisma.image.create({
        data: {
          contentLength: input.contentLength,
          uploadedBy: ctx.session.user.name as string,
        }
      })

      const putObjectCommand = new PutObjectCommand({
        Bucket: "env.BUCKET_NAME",
        Key: `${newImage.id}.jpeg`,
        ContentLength: input.contentLength,
        ContentType: "image/jpeg",
      });

      const signedUrl = await getSignedUrl(s3, putObjectCommand);
      return { signedUrl, imageId: newImage.id, key };
    }),
  setImageAsUploaded: protectedProcedure
    .input(z.object({ imageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      return prisma.image.update({
        where: { id: input.imageId },
        data: { uploadedAt: new Date() }
      });
    }),
  listAllUploadedImages: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    return prisma.image.findMany({
      where: { uploadedAt: { not: null } },
      orderBy: { uploadedAt: "desc" }
    });
  }),
  getSignedUrl: protectedProcedure.input(z.object({ imageId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { s3 } = ctx;
      const { imageId } = input;

      const getSignedUrlCommand = new GetObjectCommand({
        Bucket: "env.BUCKET_NAME",
        Key: `${imageId}.jpeg`,
      });

      const signedUrl = await getSignedUrl(s3, getSignedUrlCommand);
      return { signedUrl };
    }),
});
