import { z } from "zod";

export const RequestorFormSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  manager: z.string().trim().min(1, "Manager is required"),
  contactInfo: z.string().min(1, "Contact information is required"),
});

export const RequestFormSchema = RequestorFormSchema.extend({
  requestType: z.enum(["Report an Issue", "Request a New Asset"], {
    required_error: "Request Type is required",
  }),
});

export const ReportIssueSchema = RequestFormSchema.extend({
  issueCategory: z.string().trim().min(1, "Issue category is required"),
  assetAffected: z.string().optional(),
  problemDescription: z
    .string()
    .trim()
    .min(1, "Detailed description is required"),
  supportingFiles: z.any().optional(),
});

export const RequestNewAssetSchema = RequestFormSchema.extend({
  assetType: z.string().min(1, "Asset type is required"),
  assetSpecification: z
    .string()
    .trim()
    .min(1, "Asset specifications or model is required"),
  requestJustification: z
    .string()
    .trim()
    .min(1, "Justification for request is required"),
  requestDate: z.date().nullable().optional(),
});

export type ReportIssueFormData = z.infer<typeof ReportIssueSchema>;
export type RequestAssetFormData = z.infer<typeof RequestNewAssetSchema>;
export type RequestorFormData = z.infer<typeof RequestorFormSchema>;
