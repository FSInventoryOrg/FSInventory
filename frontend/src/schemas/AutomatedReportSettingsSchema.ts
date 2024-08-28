import { z } from 'zod';

export const AutomatedReportSettingsSchema = z.object({
  contact: z.string().trim().email('Not a valid email address!'),
  recipient: z.array(z.string().trim().email()),
});
