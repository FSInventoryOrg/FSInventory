import { z } from "zod";

export const RequestorFormSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  manager: z.string().trim().min(1, "Manager is required"),
  contactInfo: z.string().min(1, "Contact information is required"),
});

export const ReportIssueSchema = z.object({
  requestType: z.literal("Report an Issue"),
  issueCategory: z.string().trim().min(1, "Issue category is required"),
  assetAffected: z.string().optional(),
  problemDescription: z
    .string()
    .trim()
    .min(1, "Detailed description is required"),
  supportingFiles: z.array(z.instanceof(File)).optional(),
});

export const RequestNewAssetSchema = z.object({
  requestType: z.literal("Request a New Asset"),
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
const REQUEST_TYPES = ["Report an Issue", "Request a New Asset"] as const;
export const RequestFormSchema = z
  .object({
    requestType: z.enum(REQUEST_TYPES, {
      required_error: "Request Type is required",
    }),
  })
  .and(RequestorFormSchema)
  .and(
    z.discriminatedUnion("requestType", [
      ReportIssueSchema,
      RequestNewAssetSchema,
    ])
  );

export type ReportIssueFormData = z.infer<typeof ReportIssueSchema>;
export type RequestAssetFormData = z.infer<typeof RequestNewAssetSchema>;
export type RequestorFormData = z.infer<typeof RequestorFormSchema>;
export type RequestFormData = z.infer<typeof RequestFormSchema>;
export type RequestType = (typeof REQUEST_TYPES)[number];
