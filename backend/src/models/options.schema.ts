import mongoose, { Schema, Document } from 'mongoose';

export type StatusOptions = {
  value: string;
  color?: string;
  tracked?: boolean;
}

export type CategoryOptions = {
  value: string;
  properties?: string[];
}

export type Defaults = {
  status?: string;
  category?: string;
  equipmentType?: string;
  deployableStatus?: string[];
  retrievableStatus?: string;
  inventoryColumns?: string[];
}

export interface OptionsType extends Document {
  _id: string;
  status: StatusOptions[];
  category: CategoryOptions[];
  equipmentType: string[];
  defaults: Defaults;
  adminLists?: string[];
}

const optionsSchema: Schema<OptionsType> = new Schema<OptionsType>({
  status: { 
    type: [{ 
      value: { type: String, required: true }, 
      color: { type: String, required: false },
      tracked: { type: Boolean, required: false }
    }], 
    required: true 
  },
  category: { 
    type: [{
      value: { type: String, required: true },
      properties: { type: [String], required: false}
    }],
    required: true },
  equipmentType: { type: [String], required: true },
  defaults: {
    type: { 
      status: { type: String, required: false }, 
      category: { type: String, required: false },
      equipmentType: { type: String, required: false },
      deployableStatus: { type: [String], required: true },
      retrievableStatus: { type: String, required: true },
      inventoryColumns: { type: [String], required: false },
    }, 
  },
  adminLists: { type: [String], required: false}
});
// deployableStatus: { type: [String], required: true },
//       retrievableStatus: { type: [String], required: true },
// deployableStatus: { type: String, required: false },
//       retrievableStatus: { type: String, required: false },
const Option = mongoose.model<OptionsType>("Options", optionsSchema);

export default Option;
