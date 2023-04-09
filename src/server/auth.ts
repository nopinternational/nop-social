import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { auth as authApp } from "../lib/firebase/firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { use } from "react";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      console.log("callbacks.session.session", session);
      console.log("callbacks.session.user", user)
      if (session.user && user) {

        session.user.id = user.id;
        // session.user.role = user.role; <-- put other properties on the session here
      }
      console.log("callbacks.session.return_session", session);
      return session;
    },
  },
  //adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "nop-auth",
      name: "NoP Auth",
      async authorize(credentials, req) {

        console.log("CredentialsProvider.authorize.credentials", credentials)
        //console.log("CredentialsProvider.authorize.req", req)


        const fbuser = await signInWithEmailAndPassword(authApp, credentials?.username || "", credentials?.password || "")
          .then((firebaseUser) => {




            //console.log("after authSignInWithEmailAndPassword:", firebaseUser);
            return {
              "id": firebaseUser.user.uid,
              "name": firebaseUser.user.displayName,
              "email": firebaseUser.user.email
            }
          }, (error) => {

            console.error("error in signInWithEmailAndPassword:", error);
            return null
          })


        const returnObject = { "user": fbuser }
        console.log("authorize,  returnObject:", fbuser)
        return fbuser

      },
      credentials: {
        username: { label: "Username", type: "text ", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  pages: { signIn: "/signin" },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
