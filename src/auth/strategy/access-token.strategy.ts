import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPrincipalDto } from '../dto/user-principal.dto';
import { Role } from '../enum/role.enum';

export type JwtPayload = {
    aud: string;
    jti: string;
    sub: string;
    userId: number;
    roles: Role[];
    ati: string;
};


@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET')
        });
    }

    async validate(payload: JwtPayload) {
        if (payload.ati) {
            throw new UnauthorizedException();
        }
        if (payload.aud !== this.configService.get('JWT_AUDIENCE')) {
            throw new UnauthorizedException();
        }
        const userPrincipal: UserPrincipalDto = {
            userId: payload.userId,
            roles: payload.roles
        }
        return userPrincipal;
    }
}
