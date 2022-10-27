import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPrincipalDto } from '../dto/user-principal.dto';
import { JwtPayload } from './access-token.strategy';


@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
            passReqToCallback: true
        });
    }

    validate(req: Request, payload: JwtPayload) {
        if (!payload.ati) {
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
