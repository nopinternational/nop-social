import { z } from "zod";

export const CircleSchema = z.object({
    name: z.string(),
    type: z.string()
  });
  