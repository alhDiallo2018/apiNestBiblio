import { ApiTags } from '@nestjs/swagger';
import { IsArray, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

@ApiTags('books')
export class CreateBookDto {
    @IsString()
    title: string;

    @IsString()
    author: string;

    @IsOptional()
    @IsDate()
    publishedDate?: Date;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsNumber()
    rating?: number;

    @IsOptional()
    @IsArray()
    reviews?: string[];
}
