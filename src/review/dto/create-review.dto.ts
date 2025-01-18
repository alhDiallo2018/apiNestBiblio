import { ApiTags } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

@ApiTags('review')
export class CreateReviewDto {
    @IsString()
    comment: string;

    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @IsString()
    userId: string;

    @IsOptional()
    @IsDate()
    createdAt?: Date;
}
