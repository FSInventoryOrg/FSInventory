export interface AssetType {
  _id: string;
  created: Date;
  createdBy: string;
  updated: Date;
  updatedBy: string;
  type: "Hardware" | "Software";
  code: string;
  brand: string;
  modelName: string;
  modelNo: string;
  serialNo: string;
}

export type DeploymentHistory = {
  deploymentDate: Date;
  recoveryDate?: Date;
  assignee: string;
}

export interface HardwareType extends AssetType {
  category: string;
  processor: string;
  memory: string;
  storage: string;
  status: string;
  assignee: string;
  purchaseDate: Date;
  supplierVendor: string;
  pezaForm8105: string;
  pezaForm8106: string;
  isRGE: boolean;
  equipmentType: string;
  remarks: string;
  deploymentDate: Date;
  recoveredFrom: string;
  recoveryDate: Date;
  client: string;
  deploymentHistory: DeploymentHistory[];
}

export interface SoftwareType extends AssetType {
  license: string;
  version: string;
}

export type AssetCounter = {
  _id?: string;
  category: string;
  prefixCode: string;
  threshold: number;
  counter: number;
  type: "Hardware" | "Software";
};

