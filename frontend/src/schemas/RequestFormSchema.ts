import { z } from 'zod'
export const RequestFormSchema = z.object({
    requestType: z.enum(['Report an Issue', 'Request a New Asset'], {
      required_error: 'Request Type is required',
    }),
    fullName: z.string().min(1,'Full Name is required'),
    manager: z.string().min(1,'Manager is required'),
    contactInfo: z.string().min(1,'Contact Information is required'),
    assetType: z.string().optional(),
    assetSpecification: z.string().optional(),
    requestJustification: z.string().optional(),
    requestDate: z.string().optional(),
  });


export const ReportIssueSchema = RequestFormSchema.extend({
    issueCategory: z.string().optional(),
    assetAffected: z.string().optional(),
    problemDescription: z.string().optional(),
    supportingFiles: z.any().optional()
})

export const RequestNewAssetSchema = RequestFormSchema.extend({
    assetType: z.string().optional(),
    assetSpecification: z.string().optional(),
    requestJustification: z.string().optional(),
    requestDate: z.string().optional()
})
