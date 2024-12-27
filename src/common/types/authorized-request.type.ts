import { IUserInfo } from "../interfaces/user-info.interface";

export type AuthorizedRequest = {
  user: IUserInfo;
  roleBasedFilter?: any;
  country?: {
    id: number;
    code: string;
  };
};
