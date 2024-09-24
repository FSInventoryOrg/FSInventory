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
  category: string;
  deploymentDate: Date;
  recoveredFrom: string;
  recoveryDate: Date;
  deploymentHistory: DeploymentHistory[];
  status: string;
  assignee: string;
  _addonData_assignee?: string;
  _addonData_recoveredFrom?: string;
  purchaseDate: Date;
  remarks: string;
}

export type DeploymentHistory = {
  _addonData_assignee?: string;
  deploymentDate: Date;
  recoveryDate?: Date;
  assignee: string;
}

export interface HardwareType extends AssetType {
  processor: string;
  memory: string;
  storage: string;
  supplierVendor: string;
  pezaForm8105: string;
  pezaForm8106: string;
  isRGE: boolean;
  equipmentType: string;
  client: string;
}

export interface SoftwareType extends AssetType {
  license: string;
  licenseType: string;
  licenseCost: number;
  licenseExpirationDate: Date;
  noOfLicense: number;
  version: string;
  softwareName: string;
  vendor: string;
  installationPath: string;
}

export type AssetCounterType = {
  _id?: string;
  category: string;
  prefixCode: string;
  threshold: number;
  counter: number;
  type: "Hardware" | "Software";
};

