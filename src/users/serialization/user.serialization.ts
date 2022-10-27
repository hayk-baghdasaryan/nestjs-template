import { Role } from "../../auth/enum/role.enum";
import { UserDto } from "../dto/user.dto";
import { RoleEntity } from "../entity/role.enitity";
import { User } from "../entity/user.entity";

export const toUserDto = (user: User): UserDto => {
    const dto: UserDto = {
        userId: user.userId,
        email: user.email,
        password: user.password,
        roles: toRoleEnums(user.roles)
    };

    return dto;
};

export const toRoleEnum = (role: RoleEntity): Role => {
    switch (role.name) {
        case Role.User:
            return Role.User;
        case Role.Admin:
            return Role.Admin;
        default:
            return null;
    }
}

export const toRoleEnums = (roles: RoleEntity[]): Role[] => {
    if (roles) {
        return roles.map(r => toRoleEnum(r))
    }
}
