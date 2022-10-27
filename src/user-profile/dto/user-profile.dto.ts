import { Max, Min, IsNumberString, IsNotEmpty } from 'class-validator';

export class UserProfileDto {
    @IsNotEmpty()
    userName: string;

    @Max(70, { message: "too old" })
    @Min(18, { message: "too young"})
    age: number;
}
