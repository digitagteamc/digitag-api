import { IsEmail, IsInt, IsNotEmpty, IsObject, IsOptional, IsString, Matches, MaxLength, Min } from "class-validator";
import { Transform } from "class-transformer";

export class CreateCreatorDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(120)
    email: string;

    @Transform(({ value }) => typeof value === 'string' ? value.replace(/\s+/g, "") : value)
    @IsString()
    @IsNotEmpty()
    @MaxLength(15)
    @Matches(/^\+?\d{10,15}$/, { message: "phoneNumber must be 10-15 digits (optionally starting with +)" })
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsString()
    @IsNotEmpty()
    creatorName: string;

    @IsString()
    @IsNotEmpty()
    industry: string;

    @IsString()
    @IsNotEmpty()
    adsPreference: string;

    @IsString()
    @IsNotEmpty()
    primaryPlatform: string;

    @IsObject()
    @IsNotEmpty()
    socialLinks: Record<string, string>;

    @IsInt()
    @Min(0)
    followerCount: number;

    @IsString()
    @IsOptional()
    profilePicture?: string;

    @IsString()
    @IsOptional()
    bio?: string;

    @IsString()
    @IsOptional()
    collaborationInterests?: string;

    // Geo fields for unique key
    @IsString()
    @IsNotEmpty()
    state: string;

    @IsString()
    @IsNotEmpty()
    district: string;

    @IsString()
    @IsNotEmpty()
    language: string;

    // Optional legacy fields (nullable in DB)
    @IsString()
    @IsOptional()
    instagram?: string;

    @IsString()
    @IsOptional()
    category?: string;
}
