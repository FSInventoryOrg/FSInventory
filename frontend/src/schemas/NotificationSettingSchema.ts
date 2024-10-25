import { z } from 'zod';

export const NotificationSettingSchema = z.object({
    daysBeforeLicenseExpiration: z.coerce.number().min(1).max(365),
});

export type NotificationSettingFormData = z.infer<typeof NotificationSettingSchema>;