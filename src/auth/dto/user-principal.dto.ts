import { Role } from "../enum/role.enum";

export class UserPrincipalDto {
    userId: number;

    roles: Role[];
}
