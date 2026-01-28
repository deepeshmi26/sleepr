import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { catchError, map, Observable, tap } from 'rxjs';
import { AUTH_SERVICE } from "../constants";
import { UserDto } from "../dto";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) { }
    canActivate(context: ExecutionContext): Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies?.Authentication;
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }
        return this.authClient.send<UserDto>('authenticate', {
            Authentication: token,
        }).pipe(
            tap((res) => {
                context.switchToHttp().getRequest().user = res;
            }),
            map(() => {
                return true;
            }),
            catchError((err) => {
                throw new UnauthorizedException('Invalid token');
            })
        );
    }
}