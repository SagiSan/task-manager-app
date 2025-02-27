import { IsOptional, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetCommentsDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination (default is 1)',
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of comments per page (default is 10)',
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
