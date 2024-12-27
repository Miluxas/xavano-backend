import { CacheModule } from "@nestjs/cache-manager";
import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as redisStore from 'cache-manager-redis-store';
import { CommentModule } from "./comment/comment.module";
import { ResponseFormatter } from "./interceptors/formatter/formatter.interceptor";
import { PaginationModule } from "./pagination";
import { UserModule } from "./user";
import { JwtAuthGuard } from "./user/guards/jwt-auth.guard";

const configService = new ConfigService();
const nodeEnv = configService.get("NODE_ENV");
const dbConnection =
  nodeEnv == "test"
    ? {
        dropSchema: true,
        multipleStatements: true,
        synchronize: true,
      }
    : {
        dropSchema: false,
        multipleStatements: false,
        synchronize: false,
      };

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      ...dbConnection,
      host: configService.get("DB_HOST"),
      port: Number.parseInt(configService.get("DB_PORT") ?? "80"),
      username: configService.get("DB_USERNAME"),
      password: configService.get("DB_PASSWORD"),
      database: configService.get("DB_DATABASE"),
      type: "mysql",
      migrationsTableName: "migrations",
      entities: [__dirname + "/**/**.entity{.ts,.js}"],
      migrations: [__dirname + "/migrations/*.js"],
      migrationsRun: true,
      autoLoadEntities: true,
      maxQueryExecutionTime: 10 * 1000,
      connectorPackage: "mysql2",
      retryDelay: 1000,
      retryAttempts: 5,
      timezone: "Z",
      logger: "debug",
      logging: ["error"],
    }),
    CacheModule.register( process.env.NODE_ENV == "test"
          ? { isGlobal: true }
          : {
              store: redisStore,
              isGlobal: true,
              connectTimeout: 10000,
              host: configService.get("REDIS_HOST"),
              port: +configService.get("REDIS_PORT"),
              password: configService.get("REDIS_PASS"),
              auth_pass: configService.get("REDIS_PASS"),
              no_ready_check: true,
              username: "default",
              ...(configService.get("REDIS_TLS")
                ? {
                    tls: {
                      servername: configService.get("REDIS_HOST"),
                    },
                  }
                : {}),
            },
          ),
  
    UserModule,
    PaginationModule,
    CommentModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseFormatter,
    },
    { provide: APP_PIPE, useClass: ValidationPipe },
  ],
})
export class AppModule {}
