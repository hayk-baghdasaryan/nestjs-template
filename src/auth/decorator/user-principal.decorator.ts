import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPrincipalDto } from '../dto/user-principal.dto';

export const UserPrincipal = createParamDecorator(
    (data: any, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return <UserPrincipalDto>request.user;
    }
);

