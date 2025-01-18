import { ApiTags } from '@nestjs/swagger';
import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

@ApiTags('users')
export class UpdateUserDto {
    @IsOptional()
    @IsString()
    prenom?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsArray()
    roles?: string[];
}