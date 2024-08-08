import mongoose, { Schema, Document } from 'mongoose';

export interface OAuthType extends Document {
  _id: string;
  created: Date;
  createdBy: string;
  updated: Date;
  updatedBy: string;
  clientID: string;
  clientSecret: string;
  url:string;
  scopes: any
}

const oAuthSchema: Schema<OAuthType> = new Schema<OAuthType>({
  created: { type: Date, required: true },
  createdBy: { type: String, required: false},
  updated: { type: Date, required: true },
  updatedBy: { type: String, required: false},
  clientID: { type: String, required: false },
  clientSecret: { type: String, required: false },
  url: { type: String, required: false },
  scopes: { type: Array, required: false },
});

const OAuth = mongoose.model<OAuthType>("OAuths", oAuthSchema);

export default OAuth;