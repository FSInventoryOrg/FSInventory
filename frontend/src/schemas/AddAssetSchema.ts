import { z } from 'zod';

export const AssetBaseSchema = z.object({
  type: z.enum(['Hardware', 'Software']),
  code: z.string().trim().optional(),
  brand: z.string().trim().optional(),
  modelName: z.string().trim().optional(),
  modelNo: z.string().trim().optional(),
  serialNo: z.string().trim().min(1, 'Serial number is required'),
  remarks: z.string().trim().optional(),
  notifyRemarks: z.boolean().optional(),
  status: z.string().trim().min(1, 'Asset status is required'),
  deploymentDate: z.date().nullable().optional(),
  recoveredFrom: z.string().trim().optional(),
  recoveryDate: z.date().nullable().optional(),
  assignee: z.string().trim().optional(),
  category: z.string().trim().min(1, 'Asset category is required'),
  purchaseDate: z.date().nullable().optional(),
});
export const SoftwareSchema = AssetBaseSchema.extend({
  softwareName: z.string().trim().min(1, 'Software name is required'),
  serialNo: z.string().trim().min(1, 'License Key/Serial number is required'),
  vendor: z.string().trim().min(1, 'Vendor is required'),
  licenseType: z.string().trim().min(1, 'License type is required'),
  licenseExpirationDate: z.date({
    required_error: 'License expiration date is required',
  }),
  licenseCost: z
    .number({
      coerce: true,
      invalid_type_error: 'Invalid input. Please enter a number',
    })
    .refine((arg) => !!arg, {
      message: 'License cost is required',
    }),
  purchaseDate: z.date({
    required_error: 'Purchase date is required',
  }),
  noOfLicense: z
    .number({
      coerce: true,
      invalid_type_error: 'Invalid input. Please enter a number',
    })
    .refine((arg) => !!arg, {
      message: 'Number of License is required',
    }),
  installationPath: z
    .string()
    .trim()
    .regex(
      RegExp(/^[a-z]:((\\|\/)[a-z0-9\s_@\-^!#$%&+={}\[\]]+)+/i),
      'Must be a valid path'
    )
    .optional(),
});

export const HardwareSchema = AssetBaseSchema.extend({
  type: z.enum(['Hardware', 'Software']),
  code: z.string().trim().optional(),
  brand: z.string().trim().optional(),
  modelName: z.string().trim().optional(),
  modelNo: z.string().trim().optional(),
  serialNo: z.string().trim().min(1, 'Serial number is required'),
  processor: z.string().trim().optional(),
  memory: z.string().trim().optional(),
  storage: z.string().trim().optional(),
  status: z.string().trim().min(1, 'Asset status is required'),
  // serviceInYears: z.number().optional(),
  supplierVendor: z.string().trim().optional(),
  pezaForm8105: z.string().trim().optional(),
  pezaForm8106: z.string().trim().optional(),
  isRGE: z.boolean().optional(),
  equipmentType: z.string().trim().min(1, 'Equipment type is required'),
  remarks: z.string().trim().optional(),
  client: z.string().trim().optional(),
  license: z.string().trim().optional(),
  version: z.string().trim().optional(),
});

export type AssetFormData = z.infer<
  typeof HardwareSchema | typeof SoftwareSchema
>;
export type AssetFormData2 = z.infer<typeof HardwareSchema>;
export type AssetFormData3 = z.infer<typeof SoftwareSchema>;

export const refineAssetSchema = (retrievableStatus?: string) => {
  return (arg: AssetFormData, ctx: z.RefinementCtx) => {
    if (arg.recoveredFrom?.trim()) {
      if (!arg.recoveryDate) {
        ctx.addIssue({
          code: 'custom',
          message: 'Recovery date is required',
          path: ['recoveryDate'],
        });
      }
    }
    if (arg.status && arg.status === retrievableStatus) {
      if (!arg.assignee?.trim()) {
        ctx.addIssue({
          code: 'custom',
          message: 'Assignee is required',
          path: ['assignee'],
        });
      }
      if (!arg.deploymentDate) {
        ctx.addIssue({
          code: 'custom',
          message: 'Deployment date is required',
          path: ['deploymentDate'],
        });
      }
    }
  };
};
