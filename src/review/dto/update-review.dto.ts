import { ApiTags } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

@ApiTags('review')
export class UpdateReviewDto {
    @IsOptional()
    @IsString()
    comment?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating?: number;

    @IsOptional()
    @IsString()
    userId?: string; 

    @IsOptional()
    @IsDate()
    createdAt?: Date;
}
