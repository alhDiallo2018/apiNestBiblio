import { ApiTags } from '@nestjs/swagger';
import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

@ApiTags('users')
export class CreateUserDto {
    @IsString()
    prenom: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsOptional()
    @IsArray()
    roles?: string[];
}


