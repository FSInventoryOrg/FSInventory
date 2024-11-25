import { z } from "zod";

export const RequestorFormSchema = z.object({
  employeeName: z.string().trim().min(1, "Full name is required"),
  managerName: z.string().trim().min(1, "Manager is required"),
  employeeEmail: z.string().min(1, "Contact information is required"),
});

export const ReportIssueSchema = z.object({
  type: z.literal("Issue Report"),
  issueCategory: z.string().trim().min(1, "Issue category is required"),
  assetAffected: z.string().optional(),
  issueDescription: z
    .string()
    .trim()
    .min(1, "Detailed description is required"),
  supportingFiles: z.array(z.instanceof(File)).optional(),
});

export const RequestNewAssetSchema = z.object({
  type: z.literal("Asset Request"),
  assetType: z.string().min(1, "Asset type is required"),
  assetSpecsModel: z
    .string()
    .trim()
    .min(1, "Asset specifications or model is required"),
  justification: z
    .string()
    .trim()
    .min(1, "Justification for request is required"),
  requestedDate: z.date().nullable().optional(),
});

const REQUEST_TYPES = ["Issue Report", "Asset Request"] as const;

export const RequestFormSchema = z
  .object({
    type: z.enum(REQUEST_TYPES, {
      required_error: "Request Type is required",
    }),
  })
  .and(RequestorFormSchema)
  .and(
    z.discriminatedUnion("type", [ReportIssueSchema, RequestNewAssetSchema])
  );

export type ReportIssueFormData = z.infer<typeof ReportIssueSchema>;
export type RequestAssetFormData = z.infer<typeof RequestNewAssetSchema>;
export type RequestorFormData = z.infer<typeof RequestorFormSchema>;
export type RequestFormData = z.infer<typeof RequestFormSchema>;
export type RequestType = (typeof REQUEST_TYPES)[number];
