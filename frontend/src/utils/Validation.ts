import { z } from 'zod';

export const orderSchema = z.object({
    dishName: z.string().min(1, 'Dish name is required'),
    quantity: z.number().int().positive('Quantity must be a positive integer'),
  });