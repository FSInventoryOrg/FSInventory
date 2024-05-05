export type AssetsHistory = {
  deploymentDate: Date;
  recoveryDate: Date;
  assetCode: string;
}

export interface EmployeeType {
  _id: string;
  code: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  name: string;
  position: string;
  startDate: Date;
  isActive: boolean;
  isRegistered: boolean;
  assetsHistory?: AssetsHistory[];
}