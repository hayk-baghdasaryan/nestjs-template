import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Roles } from '../../auth/decorator/roles.decorator';
import { UserPrincipal } from '../../auth/decorator/user-principal.decorator';
import { UserPrincipalDto } from '../../auth/dto/user-principal.dto';
import { Role } from '../../auth/enum/role.enum';
import { UserProfileDto } from '../dto/user-profile.dto';
import { UserProfileService } from '../service/user-profile.service';

@Roles(Role.User)
@Controller('/userprofile')
export class UserProfileController {
    constructor(private userProfileService: UserProfileService) { }

    /**
     * Test API showing Authorization process. Accessible to users with User role only. 
     */
    @ApiResponse({ type: UserProfileDto })
    @Roles(Role.User)
    @Get("/user")
    async getUserProfileByAdmin(
        @UserPrincipal() userPrincipal: UserPrincipalDto): Promise<UserProfileDto> {
        return this.userProfileService.getById(userPrincipal.userId);
    }

    /**
     * Test API showing Authorization process. Accessible to users with Admin role only. 
     */
    @ApiResponse({ type: UserProfileDto })
    @Roles(Role.Admin)
    @Get("/admin")
    async getUserProfileByUser(
        @UserPrincipal() userPrincipal: UserPrincipalDto): Promise<UserProfileDto> {
        return this.userProfileService.getById(userPrincipal.userId);
    }

    /**
     * Test API to show how validation is done
     */
    @ApiResponse({ type: UserProfileDto })
    @Roles(Role.User)
    @Patch()
    async updateUserProfile(
        @UserPrincipal() userPrincipal: UserPrincipalDto,
        @Body() userProfile: UserProfileDto): Promise<UserProfileDto> {
        return Promise.resolve(userProfile);
    }
}
