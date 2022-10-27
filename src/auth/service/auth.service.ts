import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserDto } from '../../users/dto/user.dto';
import { UsersService } from '../../users/service/users.service';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { JwtPayload } from '../strategy/access-token.strategy';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private dataSource: DataSource
    ) { }

    async validateUser(email: string, pass: string): Promise<UserDto> {
        return this.dataSource.transaction(async manager => {
            const userDto = await this.usersService.getUserByEmail(email, manager);

            if (userDto && await bcrypt.compare(pass, userDto.password)) {
                await this.usersService.updateUserLastLoginDate(userDto.userId, new Date(), manager);
                return userDto;
            }
            return null;
        });
    }

    async authenticate(user: UserDto): Promise<AuthResponseDto> {
        const accessTokenPayload: JwtPayload = <JwtPayload>{
            jti: uuidv4(),
            aud: this.configService.get('JWT_AUDIENCE'),
            userId: user.userId,
            roles: user.roles
        };
        const refreshTokenPayload: JwtPayload = <JwtPayload>{
            jti: uuidv4(),
            aud: this.configService.get('JWT_AUDIENCE'),
            userId: user.userId,
            roles: [],
            ati: accessTokenPayload.jti
        };

        return <AuthResponseDto>{
            user_id: user.userId,
            access_token: this.jwtService.sign(accessTokenPayload, {
                expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION')
            }),
            refresh_token: this.jwtService.sign(refreshTokenPayload, {
                expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION')
            })
        };
    }

    async refreshTokens(userId: number): Promise<AuthResponseDto> {
        return this.dataSource.transaction(async manager => {
            const userDto = await this.usersService.getUserById(userId, manager);
            if (!userDto) {
                throw new ForbiddenException('Access Denied');
            }

            await this.usersService.updateUserLastLoginDate(userDto.userId, new Date(), manager);
            return this.authenticate(userDto);
        });
    }

}
