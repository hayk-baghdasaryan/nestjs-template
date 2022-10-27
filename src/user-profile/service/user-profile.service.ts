import { Injectable } from '@nestjs/common';
import { UserProfileDto } from '../dto/user-profile.dto';

@Injectable()
export class UserProfileService {
    constructor() { }

    async getById(id: number): Promise<UserProfileDto> {
        return <UserProfileDto>{};
    }
}
