import { Schema } from 'mongoose';
import Asset, { AssetType } from './asset.schema';

export interface HardwareType extends AssetType {
  processor: string;
  memory: string;
  storage: string;
  purchaseDate: Date;
  supplierVendor: string;
  pezaForm8105: string;
  pezaForm8106: string;
  isRGE: boolean;
  equipmentType: string;
  client: string;
}

/**
 * @openapi
 * components:
 *  schemas:
 *    Hardware:
 *      type: object
 *      required:
 *        - status
 *        - category
 *        - equipmentType
 *      allOf:
 *        - $ref: '#/components/schemas/Asset'
 *        - type: object
 *      properties:
 *        _id:
 *          type: string
 *          example: 01972cf9-c3c7-48c9-8628-ef6148d09c96
 *          description: Auto-generated by MongoDB/Mongoose
 *        code:
 *          type: string
 *          example: FS-XYZ-A
 *        type:
 *          type: string
 *          example: Hardware
 *        brand:
 *          type: string
 *          example: Apple
 *        modelName:
 *          type: string
 *          example: MacBook Air M2 (13-inch, 2022)
 *        modelNo:
 *          type: string
 *          example: A2681
 *        serialNo:
 *          type: string
 *          example: GD5KD-7GNCB-2TCR0-AX9Z2-KCA6J
 *        category:
 *          type: string
 *          example: Laptop
 *        processor:
 *          type: string
 *          example: M2 8-Core CPU
 *        memory:
 *          type: string
 *          example: 8GB Unified Memory
 *        storage:
 *          type: string
 *          example: 256GB SSD Storage
 *        status:
 *          type: string
 *          example: Deployed
 *        assignee:
 *          type: string
 *          example: John Doe
 *        purchaseDate:
 *          type: string
 *          format: date-time
 *          example: "2024-03-14T00:00:00.000Z"
 *        supplierVendor:
 *          type: string
 *          example: Power Mac Center
 *        pezaForm8105:
 *          type: string
 *        pezaForm8106:
 *          type: string
 *        isRGE:
 *          type: boolean
 *          example: false
 *        equipmentType:
 *          type: string
 *          example: DEV
 *        remarks:
 *          type: string
 *        notifyRemarks:
 *          type: boolean
 *        deploymentDate:
 *          type: string
 *          format: date-time
 *          example: "2024-03-14T00:00:00.000Z"
 *        recoveredFrom:
 *          type: string
 *          example: Julia Doe
 *        recoveryDate:
 *          type: string
 *          format: date-time
 *          example: "2024-03-14T00:00:00.000Z"
 *        client:
 *          type: string
 *          example: AZ Tech Inc.
 *        deploymentHistory:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              deploymentDate:
 *                type: Date
 *              recoveryDate:
 *                type: Date
 *              assignee:
 *                type: string
 *          example: [{"deploymentDate": "2024-03-14T00:00:00.000Z", "recoveryDate": "2024-03-17T00:00:00.000Z", "assignee": "John Doe"}, {"deploymentDate": "2024-03-17T00:00:00.000Z", "assignee": "Julia Doe"}]
 *          description: History of deployments for this asset
 */
const hardwareSchema: Schema<HardwareType> = new Schema<HardwareType>({
  processor: { type: String, required: false },
  memory: { type: String, required: false },
  storage: { type: String, required: false },
  assignee: { type: String, required: false },
  purchaseDate: { type: Date, required: false },
  supplierVendor: { type: String, required: false },
  pezaForm8105: { type: String, required: false },
  pezaForm8106: { type: String, required: false },
  isRGE: { type: Boolean, required: false },
  equipmentType: { type: String, required: true },
  client: { type: String, required: false },
});

const Hardware = Asset.discriminator<HardwareType>('Hardware', hardwareSchema);

export default Hardware;
