import { Role } from "@/user/types/role.type";

export interface IUserInfo {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  active: boolean;
  emailVerified: boolean;
  role: Role;
  state: string;
  deviceId?: string;
  profileId?: number;
  validAge?: number;
  platform?:string;
}
