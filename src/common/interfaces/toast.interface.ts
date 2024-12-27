import { MultiLanguage } from "../types/multi-language.type";
export type ResponseMessageType =
  | "error"
  | "warning"
  | "success"
  | "info"
  | "default";

export interface IToast {
  messageType: ResponseMessageType;
  ml_message: MultiLanguage;
}
