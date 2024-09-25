import { Schema } from 'mongoose';
import Asset, { AssetType } from './asset.schema';

export interface SoftwareType extends AssetType {
  license: string;
  licenseType: string;
  licenseExpirationDate?: Date;
  licenseCost: number;
  noOfLicense: number;
  version: string;
  softwareName: string;
  vendor: string;
  installationPath: string;
}

const softwareSchema: Schema<SoftwareType> = new Schema<SoftwareType>({
  license: { type: String, required: false },
  licenseType: { type: String, required: true },
  licenseExpirationDate: { type: Date, required: true },
  licenseCost: { type: Number, required: true },
  noOfLicense: { type: Number, required: true },
  version: { type: String, required: false },
  softwareName: { type: String, required: true},
  serialNo: { type: String, required: true },
  vendor: { type: String, required: true },
  installationPath: { type: String, required: false }
});

const Software = Asset.discriminator<SoftwareType>("Software", softwareSchema);

export default Software;
