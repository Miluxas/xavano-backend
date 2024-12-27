import { IUserInfo } from "@/common/interfaces/user-info.interface";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../services/auth.service";
import { Role } from "../types/role.type";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET"),
    });
  }

  async validate(validationPayload: {
    email?: string;
    phoneNumber?: string;
    role: Role;
    userId: string;
    tokenType: string;
    deviceId: string;
    profileId?: number;
    validAge?: number;
    platform?: string;
  }): Promise<
    | IUserInfo
    | { role: string; deviceId?: string; validAge?: number; platform?: string }
    | null
  > {
    if (validationPayload.tokenType === "public")
      return {
        role: "Public",
        deviceId: validationPayload.deviceId,
        platform: validationPayload.platform,
      };
    return this.authService
      .validate(
        validationPayload.role,
        validationPayload.email,
        validationPayload.phoneNumber
      )
      .then((user) => {
        if (user)
          return {
            ...user,
            deviceId: validationPayload.deviceId,
            profileId: validationPayload.profileId,
            platform: validationPayload.platform,
            // validAge: validationPayload.validAge,  //TODO: for active min age control uncommented this line
          };
        return null;
      });
  }
}
