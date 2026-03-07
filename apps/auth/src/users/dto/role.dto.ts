import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class RoleDto {

    @IsNumber()
    @IsOptional()
    id: number;

    @IsString()
    @IsOptional()
    name: string;
}   