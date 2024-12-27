import { LanguageEnum } from "@/common/enums/language.enum";
import {
  ValidationMessage,
  validationToastList,
} from "@/common/validation.error.message";
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { isDate, isNumber, isString } from "class-validator";
import { Response } from "express";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { IToast } from "../../common/interfaces";
import { ManipulatedRequest, StandardResponse } from "./formatter.interface";

@Injectable()
export class ResponseFormatter implements NestInterceptor {
  private readonly customMessageKeys = ["meta", "data"];
  private readonly stdErrorResponseKeys = ["meta"];
  constructor(
    protected readonly configService: ConfigService,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<ManipulatedRequest>();
    const res = context.switchToHttp().getResponse<Response>();
    if (req.url.includes("/files")) {
      if (res.statusCode === 200) return next.handle();
    }
    if (req.url.includes("export")) {
      if (res.statusCode === 200) return next.handle();
    }
    Object.assign(req, { requestedAt: Date.now() });
    context.getClass();
    return next
      .handle()
      .pipe(
        map(this.formatResponse(req, res)),
        catchError(this.formatError(res, req))
      );
  }

  formatResponse(
    req: ManipulatedRequest & { requestedAt?: number },
    res: Response
  ) {
    return async (response: any): Promise<StandardResponse> => {
      const responseTime = Date.now() - (req.requestedAt ?? Date.now());

      const time = new Date();
      if (process.env.NODE_ENV !== "test")
        console.info(
          `${time.toLocaleDateString()}, ${time.toLocaleTimeString()}\trt:${responseTime} ms \tcode: ${
            response.status ?? HttpStatus.OK
          } \turl:${req.method} ${req.url}`
        );

      if (!response) {
        return {
          meta: {
            message: "Resource not found!",
            code: HttpStatus.NOT_FOUND,
          },
          data: {},
        };
      }
      if (response.status) {
        res.statusCode = response.status;
      }
      const language: LanguageEnum =
        (req.header("lang") as LanguageEnum) ?? null;
      res.statusCode = HttpStatus.OK;
      const meta = { code: res.statusCode };
      return {
        meta,
        data: await this.stdResponse(req.url, response, language),
      };
    };
  }
  private async stdResponse(url: string, input: any, language?: string) {
    if (language != null) {
      input = this.translate(input, language);
    }
    return (input);
  }


  private translate(input: any, language: string) {
    if (Array.isArray(input)) {
      return this.translateArray(input, language);
    }
    return this.translateObject(input, language);
  }

  translateArray(input: any[], language: string) {
    const arrayOutput = 
      input.map( (item) => {
        return this.translateObject(item, language);
      })
    return arrayOutput;
  }

  translateObject(input: any, language: string) {
    if (isNumber(input) || isDate(input) || isString(input)) return input;
    const clonedInput = { ...input };
    for (const [k, v] of Object.entries(clonedInput ?? {})) {
      if (v === undefined || v === null) {
        clonedInput[k] = undefined;
        continue;
      }
      if (k.startsWith("ml_")) {
        if (Array.isArray(v)) {
          Object.assign(clonedInput, {
            [k.substring(3)]: v.map((item) => item[language] ?? item["en"]),
          });
        } else
          Object.assign(clonedInput, {
            [k.substring(3)]: clonedInput[k][language] ?? clonedInput[k]["en"],
          });
        clonedInput[k] = undefined;
      } else if (Array.isArray(v) && !isString(v)) {
        const mlObject = this.translateArray(v, language);
        Object.assign(clonedInput, { [k]: mlObject });
      } else if (typeof v === "object") {
        const mlObject = this.translateObject(v, language);
        Object.assign(clonedInput, { [k]: mlObject });
      }
    }
    return clonedInput;
  }

 

  formatError(
    response: Response,
    request: ManipulatedRequest & { requestedAt?: number }
  ) {
    return async (err: any): Promise<StandardResponse> => {
      let meta = null;

      const responseTime = Date.now() - (request.requestedAt ?? Date.now());

      const time = new Date();
      if (process.env.NODE_ENV !== "test")
        console.error(
          `${time.toLocaleDateString()}, ${time.toLocaleTimeString()}\trt:${responseTime} ms \tcode: ${
            err.status
          } \turl:${request.method} ${request.url}\t error: ${
            err.response?.message[0] ?? err.message ?? err?.message
          }`
        );
      if (
        typeof err === "object" &&
        this.stdErrorResponseKeys.some((key) => !(key in err))
      ) {
        const env = this.configService.get("NODE_ENV");
        const status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
          err.message ?? env !== "prod"
            ? err?.message
            : "Internal Server Error";
        response.statusCode = status;
        meta = {
          message: err.response?.message[0] ?? message,
          code: status,
        };
        const language: LanguageEnum =
          (request.header("lang") as LanguageEnum) ?? null;
        const toastMessage =
          validationToastList[<ValidationMessage>meta.message];
        if (toastMessage) {
          const toastSingleLanguage = this.translate(toastMessage, language);
          Object.assign(meta, toastSingleLanguage);
        }
        
        // if (meta.code === HttpStatus.INTERNAL_SERVER_ERROR) {
        //   const serverErrorToast: IToast = {
        //     messageType: "error",
        //     ml_message: {
        //       en: "We're experiencing technical difficulties. Please try again later.",
        //       ar: "We're experiencing technical difficulties. Please try again later.",
        //     },
        //   };
        //   const toastSingleLanguage = this.translate(serverErrorToast, language);
        //   Object.assign(meta, toastSingleLanguage);
        // }
      }
      if (meta) {
        return { meta };
      }
      response.statusCode = err.status ? err.status : response.statusCode;
      err.status = undefined;
      return err;
    };
  }
}
