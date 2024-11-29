import { RocksRole } from "./auth";

export interface UserType {
  _id: string;
  first_name: string;
  last_name: string;
  role: RocksRole;
  is_admin: boolean;
  email: string;
  avatar: string;
}

export interface UploadImage {
  src: string;
  filename: string;
  userId: string;
}
