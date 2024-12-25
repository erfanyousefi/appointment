import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import {isJWT} from "class-validator";
import {Request} from "express";
import {ClinicService} from "src/modules/clinic/clinic.service";
import {AuthService} from "../auth.service";

@Injectable()
export class ClinicGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private clinicService: ClinicService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    const clinicId = this.authService.verifyClinicAccessToken(token);
    const clinic = await this.clinicService.findOneById(clinicId);
    request.clinic = clinic;
    return true;
  }
  extractToken(req: Request): string {
    const {authorization = undefined} = req?.headers ?? {};
    if (!authorization) throw new UnauthorizedException();
    const [bearer, token] = authorization.split(" ");
    if (bearer.toLowerCase() !== "bearer") throw new UnauthorizedException();
    if (!token || !isJWT(token)) throw new UnauthorizedException();
    return token;
  }
}
