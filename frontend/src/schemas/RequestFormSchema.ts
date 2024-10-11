import { z } from 'zod'
export const RequestFormSchema = z.object({
    requestType: z.enum(['Report an Issue', 'Request a New Asset'], {
      required_error: 'Request Type is required',
    }),
    fullName: z.string().min(1,'Full name is required'),
    manager: z.string().min(1,'Manager is required'),
    contactInfo: z.string().min(1,'Contact information is required'),
  });


export const ReportIssueSchema = RequestFormSchema.extend({
    issueCategory: z.string().min(1, 'Issue category is required'),
    assetAffected: z.string().optional(),
    problemDescription: z.string().min(1, 'Detailed description is required'),
    supportingFiles: z.any().optional()
})

export const RequestNewAssetSchema = RequestFormSchema.extend({
    assetType: z.string().optional(),
    assetSpecification: z.string().optional(),
    requestJustification: z.string().optional(),
    requestDate: z.string().optional()
})
