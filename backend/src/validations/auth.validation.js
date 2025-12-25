import { z } from 'zod';

export const signupScheema = z.object({
  first_name: z.string().min(2).max(255).trim(),
  last_name: z.string().min(2).max(255).trim(),
  phone: z.string().max(32).trim(),
  email: z.email().max(255).toLowerCase().trim(),
  password: z.string().min(6).max(128),
  role: z.enum(['user', 'admin']).default('user'),
});

export const loginScheema = z.object({
  email: z.email().toLowerCase().trim(),
  password: z.string().min(1),
});

export const updateUserSchema = z.object({
  first_name: z.string().min(2).max(255).trim().optional(),
  last_name: z.string().min(2).max(255).trim().optional(),
  phone: z.string().max(32).trim().optional(),
});

export const addAddress = z.object({
  address_line: z.string().min(1).max(255).trim(),
  city: z.string().min(1).max(128).trim(),
  state: z.string().min(1).max(128).trim(),
  postal_code: z.string().min(1).max(16).trim(),
  country: z.string().min(1).max(128).trim(),
});

export const updateAddress = z.object({
  address_line: z.string().min(1).max(255).trim().optional(),
  city: z.string().min(1).max(128).trim().optional(),
  state: z.string().min(1).max(128).trim().optional(),
  postal_code: z.string().min(1).max(16).trim().optional(),
  country: z.string().min(1).max(128).trim().optional(),
});