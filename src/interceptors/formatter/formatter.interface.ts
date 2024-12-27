import { Request } from "express";
import { ResponseMessageType } from "@/common/interfaces";


export interface StandardResponse {
  data?: any;
  meta: {
    code: number;
    message?: string;
    messageType?: ResponseMessageType;
    validationErrors?: Record<string, string[]>;
  };
}

export interface ManipulatedRequest extends Request {
  requestId: string;
}
