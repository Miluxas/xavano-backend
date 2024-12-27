import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { compareSync, hashSync } from "bcryptjs";
import { Cache } from "cache-manager";
import { randomUUID } from "crypto";
import { Repository } from "typeorm";
import { RefreshToken, User } from "../entities";
import { AuthError, UserError } from "../errors";
import { ILoggedInInfo, ILogin } from "../interfaces";
import { Role } from "../types/role.type";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly configService: ConfigService,
    protected readonly jwtService: JwtService,

    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  public async login(loginInfo: ILogin): Promise<ILoggedInInfo> {
    return this.userRepository
      .findOne({
        where: { email: loginInfo.email, active: true },
        select: [
          "firstName",
          "password",
          "active",
          "emailVerified",
          "lastName",
          "id",
          "email",
          "phoneNumber",
          "role",
        ],
      })
      .then(async (user) => {
        if (!user) {
          throw new Error(AuthError.INVALID_EMAIL);
        }
        if (!user.emailVerified) {
          throw new Error(AuthError.EMAIL_IS_NOT_VERIFIED);
        }
        if (!user.password) throw new Error(AuthError.WRONG_PASSWORD);
        try {
          const passCheck = compareSync(loginInfo.password, user.password);
          if (!passCheck) throw new Error(AuthError.WRONG_PASSWORD);

          const refreshTokenObject = this.generateRefreshToken(user);
          await this.updateRefreshToken(
            user.id,
            refreshTokenObject.refreshToken,
            refreshTokenObject.expiresAt,
            refreshTokenObject.uid
          );
          const token = this.generateUserAccessToken(user);
          user.password = undefined;
          return {
            user,
            ...token,
            refreshToken: refreshTokenObject.refreshToken,
          };
        } catch (e) {
          console.log(e);
          throw new Error(AuthError.WRONG_PASSWORD);
        }
      });
  }

  private async updateRefreshToken(
    userId: number,
    refreshToken: string,
    expiresAt: Date,
    uid: string
  ) {
    const hashedRefreshToken = hashSync(refreshToken, 10);
    let token = await this.refreshTokenRepository.findOneBy({ userId, uid });
    if (!token) {
      token = new RefreshToken();
      token.userId = userId;
      token.uid = uid;
    }
    token.token = hashedRefreshToken;
    token.expiresAt = expiresAt;
    return this.refreshTokenRepository.save(token).catch(console.log);
  }

  private durationSeconds(timeExpr: string) {
    const units: Record<string, number> = { d: 86400, h: 3600, m: 60, s: 1 };
    const regex = /(\d+)([dhms])/g;

    let seconds = 0;
    let match;
    while ((match = regex.exec(timeExpr))) {
      seconds += parseInt(match[1]) * units[match[2]];
    }

    return seconds;
  }

  private generateRefreshToken(user: User): {
    refreshToken: string;
    expiresAt: Date;
    uid: string;
  } {
    const refreshTokenTtl = this.configService.get(
      "JWT_ADMIN_REFRESH_EXPIRES_IN"
    );

    const expiresAt = new Date(
      new Date().getTime() + 1000 * this.durationSeconds(refreshTokenTtl)
    );
    const uid = randomUUID();
    const refreshToken = this.jwtService.sign(
      {
        email: user.email,
        userId: user.id,
        uid,
      },
      {
        secret: this.configService.get<string>("JWT_ADMIN_REFRESH_SECRET"),
        expiresIn: this.configService.get<string>(
          "JWT_ADMIN_REFRESH_EXPIRES_IN"
        ),
      }
    );
    return { expiresAt, refreshToken, uid };
  }

  private async hashPassword(text: string): Promise<string> {
    const SALT_ROUND = 10;
    return hashSync(text, SALT_ROUND);
  }

  public async changePassword(
    id: number,
    oldPassword: string,
    newPassword: string
  ): Promise<{ result: string }> {
    return this.userRepository
      .findOne({
        where: { id },
        select: ["password", "id"],
      })
      .then(async (user) => {
        if (!user) {
          throw new Error(AuthError.INVALID_EMAIL);
        }
        if (compareSync(oldPassword, user.password ?? "")) {
          const newPasswordHash = await this.hashPassword(newPassword);
          return this.userRepository
            .update({ id }, { password: newPasswordHash })
            .then((updateResult) => {
              return { result: "New password is set" };
            });
        } else {
          throw new Error(AuthError.WRONG_PASSWORD);
        }
      });
  }

  public validate(
    role: Role,
    email?: string,
    phoneNumber?: string
  ): Promise<User | null> {
    return this.userRepository
      .findOneBy({ email, role, phoneNumber });
  }

  public verifyRefreshToken(refreshToken: string) {
    return this.jwtService.verify<{
      email: string;
      userId: number;
      uid: string;
    }>(refreshToken, {
      secret: this.configService.get<string>("JWT_ADMIN_REFRESH_SECRET"),
    });
  }

  async validateRefreshToken(
    userId: number,
    token: string,
    uid: string
  ): Promise<boolean> {
    const foundedToken = await this.refreshTokenRepository.findOne({
      where: {
        userId,
        uid,
      },
      select: ["id", "token"],
    });
    if (foundedToken && token && compareSync(token, foundedToken.token)) {
      return true;
    }
    return false;
  }

  async getRefreshToken(
    userId: number,
    uid: string
  ): Promise<string | undefined> {
    const identity = await this.refreshTokenRepository.findOneBy({
      userId,
      uid,
    });
    return identity?.token;
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOneBy({
      id: userId,
      active: true,
    });
    if (!user) throw new Error(AuthError.UNAUTHORIZED);
    const refreshTokenParts = refreshToken.split(" ");
    const verifiedRefreshToken = this.verifyRefreshToken(refreshTokenParts[1]);
    if (!verifiedRefreshToken) throw new Error(AuthError.UNAUTHORIZED);
    const userRefreshToken = await this.getRefreshToken(
      user.id,
      verifiedRefreshToken.uid
    );
    if (!userRefreshToken) throw new Error(AuthError.UNAUTHORIZED);

    const isRefreshTokenValid = await this.validateRefreshToken(
      user.id,
      refreshTokenParts[1],
      verifiedRefreshToken.uid
    );

    if (!isRefreshTokenValid) throw new Error(AuthError.UNAUTHORIZED);

    const accessToken = this.generateUserAccessToken(user);
    return accessToken;
  }

  private generateUserAccessToken(user: User): {
    token: string;
    expiresIn: string;
  } {
    const data = {
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      userId: user.id,
      tokenType: "private",
    };
    const expiresIn =
      this.configService.get<string>("JWT_EXPIRES_IN") ?? "600s";
    const secret = this.configService.get<string>("JWT_SECRET");
    const token = this.jwtService.sign(data, {
      secret,
      expiresIn,
    });
    return { token, expiresIn };
  }

  public async getUserInfo(id: number) {
    const user = await this.userRepository.findOne({
      where: { id, userType: "App" },
      select: [
        "firstName",
        "active",
        "emailVerified",
        "lastName",
        "id",
        "email",
        "phoneNumber",
        "role",
      ],
    });
    if (!user) throw new Error(UserError.NOT_FOUND);

    return user;
  }

  async logout(
    userId: number,
    profileId?: number
  ): Promise<{ result: string }> {
   
    return {
      result: "User logged out.",
    };
  }
}
