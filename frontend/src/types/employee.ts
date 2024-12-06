export type AssetsHistory = {
  deploymentDate: Date;
  recoveryDate: Date;
  assetCode: string;
};

export interface EmployeeType {
  _id: string;
  code: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  name: string;
  position: string;
  startDate: Date;
  isActive: boolean;
  isRegistered: boolean;
  assetsHistory?: AssetsHistory[];
  state?: string;
}
