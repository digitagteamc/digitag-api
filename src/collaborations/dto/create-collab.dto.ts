import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateCollabDto {
    @IsUUID()
    @IsNotEmpty()
    creatorId: string;

    @IsString()
    @IsNotEmpty()
    requirement: string;

    @IsString()
    @IsOptional()
    budget?: string;

    @IsString()
    @IsOptional()
    timeline?: string;

    @IsString()
    @IsOptional()
    message?: string;
}
