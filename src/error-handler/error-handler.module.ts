import { DynamicModule, Module } from "@nestjs/common";
import { ErrorHandlerService } from "./services";
import { ERROR_MESSAGES } from "./constants";
import { IMessageList } from "./interfaces";

@Module({})
export class ErrorHandlerModule {
  static register(messages: IMessageList<any>): DynamicModule {
    return {
      module: ErrorHandlerModule,
      providers: [
        {
          provide: ERROR_MESSAGES,
          useValue: messages,
        },
        ErrorHandlerService,
      ],
      exports: [ErrorHandlerService],
    };
  }
}
