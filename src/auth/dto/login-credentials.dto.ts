import { ApiProperty } from "@nestjs/swagger";

export class LoginCredentialsDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;
}
