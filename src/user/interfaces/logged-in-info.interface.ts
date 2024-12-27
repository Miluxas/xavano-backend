import { IUserInfo } from "@/common/interfaces/user-info.interface";

export interface ILoggedInInfo {
  user: IUserInfo;
  token: string;
  refreshToken: string;
  expiresIn: string;
  deviceId?: string;
}
