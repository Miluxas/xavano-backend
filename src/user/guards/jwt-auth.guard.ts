import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService, RBACService } from "../services/";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(
    private readonly rBACService: RBACService,
    protected readonly authService: AuthService
  ) {
    super();
  }
  exceptionUrlList = ["/auth/login", "/healthz/live", "/healthz/ready"];

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let pureUrl = context.switchToHttp().getRequest().url.split("?")[0];
    if (this.exceptionUrlList.includes(pureUrl)) {
      return true;
    }
    const baseGuardResult = await super.canActivate(context);
    if (!baseGuardResult) {
      throw new UnauthorizedException();
    }
    const bearer: string = context.switchToHttp().getRequest()
      .headers?.authorization;
    if (!bearer) {
      throw new UnauthorizedException();
    }
    const token = this.getToken(bearer);
    if (!token) {
      throw new UnauthorizedException();
    }
    const { user, url, method } = context.switchToHttp().getRequest();

    const accessStatus = this.rBACService.checkAccess(
      user.role,
      user.id,
      method,
      url
    );
    context.switchToHttp().getRequest()["roleBasedFilter"] =
      accessStatus.roleBasedFilter;
    if (!accessStatus.grant)
      throw new HttpException("Access is denied.", HttpStatus.FORBIDDEN);
    return true;
  }

  private getToken(bearer: string): string | void {
    if (!bearer) return;
    return bearer.split(" ")[1];
  }
}
