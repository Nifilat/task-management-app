import { useState } from 'react';
import z from 'zod';

// Login Schema
export const loginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

// Register Schema
export const registerSchema = z
  .object({
    firstName: z.string().min(2, {
      message: 'First name must be at least 2 characters.',
    }),
    lastName: z.string().min(2, {
      message: 'Last name must be at least 2 characters.',
    }),
    email: z.email({ message: 'Invalid email address' }),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters.',
    }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
