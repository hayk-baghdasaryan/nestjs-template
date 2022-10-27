import { Module } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RoleEntity } from './entity/role.enitity';
import { User } from './entity/user.entity';
import { customUserRepositoryMethods } from './repository/user.repository';
import { UsersService } from './service/users.service';

const UserRepository = {
    provide: getRepositoryToken(User),
    inject: [getDataSourceToken()],
    useFactory(dataSource: DataSource) {
        return dataSource.getRepository(User)
            .extend(customUserRepositoryMethods);
    },
}
@Module({
    imports: [
        TypeOrmModule.forFeature([User, RoleEntity]),
    ],
    providers: [
        UsersService,
        UserRepository
    ],
    exports: [
        UsersService
    ]
})
export class UsersModule { }
