import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";

export class CreateCreatorDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(80)
    name: string;

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(120)
    email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(15)
    @Matches(/^\+?\d{10,15}$/, { message: "phoneNumber must be 10-15 digits (optionally starting with +)" })
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(80)
    instagram: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    category: string;
}
