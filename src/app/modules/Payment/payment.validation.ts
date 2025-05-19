import { z } from "zod";

export const createPaymentIntentSchema = z.object({
  amount: z.number().positive("amount must be positive number"),
});