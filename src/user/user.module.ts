import { ErrorHandlerModule } from "@/error-handler";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  AuthController,
  UserController,
} from "./controllers";
import { RefreshToken, User } from "./entities";
import {
  authErrorMessages,
  countryErrorMessages,
  profileErrorMessages,
  userErrorMessages,
} from "./errors";
import {
  AuthService,
  RBACService,
  UserService,
} from "./services";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    ErrorHandlerModule.register({
      ...userErrorMessages,
      ...authErrorMessages,
      ...countryErrorMessages,
      ...profileErrorMessages
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get("JWT_EXPIRES_IN"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AuthController,
    UserController,
  ],
  providers: [
    UserService,
    AuthService,
    JwtStrategy,
    RefreshTokenStrategy,
    RBACService,
  ],
  exports: [RBACService, AuthService, UserService],
})
export class UserModule {}
