import { Role } from "../../auth/enum/role.enum";

export class UserDto {
    userId: number;

    email: string;

    password: string;

    roles: Role[];
}
