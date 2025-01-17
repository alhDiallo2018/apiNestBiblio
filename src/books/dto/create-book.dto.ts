import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

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
}
