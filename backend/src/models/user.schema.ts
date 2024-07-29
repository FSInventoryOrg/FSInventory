import mongoose, { Schema } from 'mongoose';
import { generateHash } from '../utils/common';

export interface UserType {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  joinDate: Date;
  role: "USER" | "ADMIN";
  avatar: string;
}

const userSchema: Schema<UserType> = new mongoose.Schema<UserType>({
  email: { type: String, required: true, unique: true },
  // TODO: Remove select: false. Temporarily excludes password in queried User. 
  password: { type: String, required: true, select: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  joinDate: { type: Date, required: true },
  role: { type: String, enum: ["USER", "ADMIN"], required: true },
  avatar: {type: String, required: false }
});

/* HASH PASSWORD */
userSchema.pre("save", async function(next) {
  if(this.isModified('password')) {
    this.password = await generateHash(this.password)
  }
  next();
})

const User = mongoose.model<UserType>("User", userSchema);

export default User;

