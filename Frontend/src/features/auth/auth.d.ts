export type LoginCredentials = { username: string; password: string };
export type SignUpData = {
  username: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  email: string;
};
export type UserDetails = {
  fullName: string;
  username: string;
  email: string;
  createAt: Date;
  role: Role;
};
export type Role = "ADMIN" | "USER";
