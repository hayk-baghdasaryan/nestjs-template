import { ApiResponseProperty } from "@nestjs/swagger";

export class AuthResponseDto {
    @ApiResponseProperty()
    user_id: number;

    @ApiResponseProperty()
    access_token: string;

    @ApiResponseProperty()
    refresh_token: string;
};
