import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UserDto } from '../dto/user.dto';
import { User } from '../entity/user.entity';
import { UserRepository } from '../repository/user.repository';
import * as UserMapper from '../serialization/user.serialization';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: UserRepository
    ) { }

    private getUserRepository(manager?: EntityManager): UserRepository {
        if (manager) {
            return manager.withRepository(this.userRepository);
        }
        return this.userRepository;
    }

    async getUserByEmail(email: string, manager?: EntityManager): Promise<UserDto | undefined> {
        const user = await this.getUserRepository(manager).findByEmail(email);
        if (user) {
            return UserMapper.toUserDto(user);
        }
        return null;
    }

    async getUserById(userId: number, manager?: EntityManager): Promise<UserDto | undefined> {
        const user = await this.getUserRepository(manager).findByUserId(userId);
        if (user) {
            return UserMapper.toUserDto(user);
        }
        return null;
    }

    async updateUserLastLoginDate(userId: number, date: Date, manager?: EntityManager) {
        await this.getUserRepository(manager).update({ userId: userId }, { lastLoginDate: date });
    }
}
