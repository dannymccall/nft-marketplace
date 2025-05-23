import { z } from "zod";

export const createNFTSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  collection: z.string().min(1, "Select a collection"),
  price: z.number().min(0.01, "Price must be greater than 0.01!"),
  sell: z.boolean().optional(),
//   file: z.instanceof(File).refine((file) => file.size > 0, {
//     message: "File is required",
//   }),
});

export const userEditForm = z.object({
  username: z.string(),
  email: z.string().email()
})
