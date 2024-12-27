import { IToast } from "./interfaces";

export enum ValidationMessage {
  INVALID_PHONE_NUMBER = "INVALID_PHONE_NUMBER",
  INVALID_EMAIL = "INVALID_EMAIL",
}

export const validationToastList: Record<ValidationMessage, IToast> = {
  [ValidationMessage.INVALID_EMAIL]: {
    messageType: "error",
    ml_message: {
      en: "Email is NOT valid.",
      ar: "ایمیل غير صالح.",
    },
  },
  [ValidationMessage.INVALID_PHONE_NUMBER]: {
    messageType: "error",
    ml_message: {
      en: "Phone number is NOT valid.",
      ar: "رقم الهاتف غير صالح.",
    },
  },
};
