import {
  ValidationArguments,
  ValidationOptions,
  isPhoneNumber,
  registerDecorator,
} from "class-validator";
import { ValidationMessage } from "../validation.error.message";

export function IsValidPhoneNumber(validationOptions?: ValidationOptions) {
  validationOptions = {}
  validationOptions.message = ValidationMessage.INVALID_PHONE_NUMBER;
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IsValidPhoneNumber",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,

      validator: {
        validate(value: string, args: ValidationArguments) {
          const isPhoneValid = isPhoneNumber(value);
          return isPhoneValid && value.includes("-");
        },
      },
    });
  };
}
