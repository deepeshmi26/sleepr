import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserDocument } from "../models/user.schema";


const getCurrentUserByContext = (ctx: ExecutionContext): UserDocument => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
}

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => getCurrentUserByContext(ctx)
);