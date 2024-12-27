import { Role } from "../types/role.type";

export interface IUpdatedUser {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  role?: Role;
}
