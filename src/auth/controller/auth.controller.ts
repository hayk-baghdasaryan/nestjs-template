import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Public } from '../decorator/public.decorator';
import { UserPrincipal } from '../decorator/user-principal.decorator';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginCredentialsDto } from '../dto/login-credentials.dto';
import { UserPrincipalDto } from '../dto/user-principal.dto';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { RefreshTokenGuard } from '../guard/refresh-token.guard';
import { AuthService } from '../service/auth.service';


@ApiTags('Authentication')
@Controller('/auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiOkResponse({ type: AuthResponseDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized Request' })
    @Public()
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async login(@Request() req, @Body() user: LoginCredentialsDto): Promise<AuthResponseDto> {
        return this.authService.authenticate(req.user);
    }

    @ApiOkResponse({ type: AuthResponseDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized Request' })
    @Public()
    @UseGuards(RefreshTokenGuard)
    @HttpCode(HttpStatus.OK)
    @Post('/refresh')
    async refreshTokens(@UserPrincipal() userPrincipal: UserPrincipalDto): Promise<AuthResponseDto> {
        return this.authService.refreshTokens(userPrincipal.userId);
    }

}
