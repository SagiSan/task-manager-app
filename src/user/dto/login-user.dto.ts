import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ description: 'The email address of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the user (min 6 characters)',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
