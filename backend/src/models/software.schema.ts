import { Schema } from 'mongoose';
import Asset, { AssetType } from './asset.schema';

export interface SoftwareType extends AssetType {
  license: string;
  version: string;
  expirationDate?: Date;
}

const softwareSchema: Schema<SoftwareType> = new Schema<SoftwareType>({
  license: { type: String, required: false },
  version: { type: String, required: false },
  expirationDate: { type: Date, required: false },
});

const Software = Asset.discriminator<SoftwareType>("Software", softwareSchema);

export default Software;
