import { CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AUTH_SERVICE } from "../constants";
import { User } from "../models";
import { Reflector } from "@nestjs/core";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    private readonly logger = new Logger(JwtAuthGuard.name);
    constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy, private readonly reflector: Reflector) { }
    canActivate(context: ExecutionContext): Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies?.Authentication || request.headers?.Authentication;
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        const roles = this.reflector.get("roles", context.getHandler());

        return this.authClient.send<User>('authenticate', {
            Authentication: token,
        }).pipe(
            tap((res) => {
                if (roles) {
                    for (const role of roles) {
                        if (!res.roles?.map(role => role.name).includes(role)) {
                            this.logger.error(`User ${res.id} does not have role ${role}`);
                            throw new UnauthorizedException('Unauthorized');
                        }
                    }
                }
                context.switchToHttp().getRequest().user = res;
            }),
            map(() => {
                return true;
            }),
            catchError((err) => {
                this.logger.error(err);
                return of(false);
            })
        );
    }
}