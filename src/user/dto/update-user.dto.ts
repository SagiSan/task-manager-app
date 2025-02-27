import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'The email address of the user' })
  @IsOptional()
  @IsEmail()
  email?: string;
}
