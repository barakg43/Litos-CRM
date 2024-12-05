import { roles } from "./UserTable";

export type UserDetails = {
  fullName: string;
  username: string;
  email: string;
  createdAt: Date;
  role: Role;
};

export type Role = (typeof roles)[number];

export interface UserSecurity
  extends Pick<UserDetails, "username" | "createdAt" | "role" | "fullName"> {
  enabled: boolean;
}

export type UserSecurityUpdateRequest = Pick<
  UserSecurity,
  "username" | "enabled" | "role"
>;
