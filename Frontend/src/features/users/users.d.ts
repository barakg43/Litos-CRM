export type UserDetails = {
  fullName: string;
  username: string;
  email: string;
  createAt: Date;
  role: Role;
};
export type Role = "ADMIN" | "USER";

export interface UserSecurity
  extends Pick<UserDetails, "username" | "createAt" | "role" | "fullName"> {
  enabled: boolean;
}

export type UserSecurityUpdateRequest = Pick<
  UserSecurity,
  "username" | "enabled" | "role"
>;
