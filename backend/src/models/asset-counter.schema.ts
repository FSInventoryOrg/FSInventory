import mongoose, { Schema, Document } from 'mongoose';

export interface AssetCounterType extends Document {
  _id: string;
  created: Date;
  createdBy: string;
  updated: Date;
  updatedBy: string;
  type: "Hardware" | "Software";
  category: string;
  prefixCode: string;
  counter: number;
  threshold: number;
  totalCount: number;
  status: "In Stock" | "Depleting"
}

const assetCounterSchema: Schema<AssetCounterType> = new Schema<AssetCounterType>({
  created: { type: Date, required: true },
  createdBy: { type: String, required: false},
  updated: { type: Date, required: true },
  updatedBy: { type: String, required: false},
  type: { type: String, enum: ["Hardware", "Software"], required: true },
  status: { type: String, enum: ["In Stock", "Depleting"], required: false },
  category: { type: String, required: true, unique: true },
  prefixCode: { type: String, required: true },
  counter: { type: Number, required: false },
  threshold: { type: Number, required: true },
  totalCount: { type: Number, required: true }
});

const AssetCounter = mongoose.model<AssetCounterType>("AssetCounter", assetCounterSchema);

export default AssetCounter;
