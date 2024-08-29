import { z } from 'zod';

export const AutomatedReportSettingsSchema = z.object({
  contact: z.string().trim().email('Not a valid email address!'),
  recipient: z.array(z.string().trim().email()),
  frequency: z.enum(['Daily', 'Weekly', 'Bi-Weekly', 'Monthly']),
  day: z.preprocess((val) => Number(val), z.number().min(1).max(31).optional()),
  weekday: z.preprocess(
    (val) => Number(val),
    z.number().min(0).max(6).optional()
  ),
  time: z
    .string()
    .trim()
    .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format.'),
});
