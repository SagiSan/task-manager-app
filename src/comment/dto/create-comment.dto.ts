import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'The comment of the task' })
  @IsNotEmpty()
  @IsString()
  content: string;
}
