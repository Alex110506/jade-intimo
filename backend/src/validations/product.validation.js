import { categoryArray, genderArray, subcategoryArray } from "#models/product.model.js";
import z, { string } from "zod";

export const createProductSchema = z.object({
  gender: z.enum(genderArray, {
    errorMap: () => ({ message: "Gender must be either 'women' or 'men'" }),
  }),
  
  category: z.enum(categoryArray, {
    errorMap: () => ({ message: "Invalid category slug provided" }),
  }),

  subCategory: z.enum(subcategoryArray).optional().nullable(),
  
  name: z.string().trim().min(3, "Name must be at least 3 chars").max(255),
  description: z.string().min(1, "Description is required"),
  material: z.string().min(2, "Material description is too short"),
  
  price: z.number().int().positive("Price must be a positive whole number in cents"),
  
  bigSizes: z.boolean().default(false),
});


export const updateProductScheema = z.object({
  gender: z.enum(genderArray, {
    errorMap: () => ({ message: "Gender must be either 'women' or 'men'" }),
  }).optional(),
  
  category: z.enum(categoryArray, {
    errorMap: () => ({ message: "Invalid category slug provided" }),
  }).optional(),
  subCategory: z.enum(subcategoryArray).optional().nullable(),
  
  name: z.string().trim().min(3, "Name must be at least 3 chars").max(255).optional(),
  image: z.string().optional(),
  description: z.string().min(1, "Description is required").optional(),
  material: z.string().min(2, "Material description is too short").optional(),

  price: z.number().int().positive("Price must be a positive whole number in cents").optional(),
  
  bigSizes: z.boolean().optional(),
});

export const createVariantScheema = z.object({
  size: z.string().min(1, "Size is required").max(32, "Size is too long"),
  quantity: z.number().int().nonnegative("Quantity cannot be negative"),
});

export const updateVariantScheema = z.object({
  size: z.string().min(1, "Size is required").max(32, "Size is too long").optional(),
  quantity: z.number().int().nonnegative("Quantity cannot be negative").optional(),
});
