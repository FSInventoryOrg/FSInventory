export interface UserType {
  _id: string;
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  joinDate: Date;
  role: "USER" | "ADMIN";
}