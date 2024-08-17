import { z } from 'zod';

export const orderSchema = z.object({
    customerName: z.string().min(1, 'Customer name is required'),
    dishName: z.string().min(1, 'Dish name is required'),
    quantity: z.number().int().positive('Quantity must be a positive integer'),
  });