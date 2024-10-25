import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  name!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  @IsMobilePhone()
  mobile_number!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  @IsStrongPassword()
  password!: string;
}

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  password!: string;
}
