import { z } from "zod";

  
  export const ProfileSchema = z.object({
    name: z.string(),
    county: z.string().optional(),
    city: z.string().optional(),
    aboutUs: z.string().optional(),
    weAreLookingFor: z.string().optional(),
  });
  