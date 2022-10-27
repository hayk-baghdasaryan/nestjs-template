import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserProfileController } from './controller/user-profile.controller';
import { UserProfileService } from './service/user-profile.service';

@Module({
    imports: [
        AuthModule
    ],
    controllers: [UserProfileController],
    providers: [UserProfileService],
    exports: [UserProfileService]
})
export class UserProfileModule { }
