import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsObject } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'User handle (username)', example: 'alice' })
  @IsString()
  @MinLength(3)
  handle: string;

  @ApiProperty({ description: 'User email', example: 'alice@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Wallet information', required: false })
  @IsOptional()
  @IsObject()
  wallet?: {
    chain: string;
    address: string;
  };

  @ApiProperty({ description: 'User preferences', required: false })
  @IsOptional()
  @IsObject()
  prefs?: {
    locale: string;
    theme: string;
  };
}

export class LoginDto {
  @ApiProperty({ description: 'User handle or email', example: 'alice' })
  @IsString()
  identifier: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsString()
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'User information' })
  user: {
    id: string;
    handle: string;
    email: string;
    wallet?: any;
    prefs?: any;
  };

  @ApiProperty({ description: 'Access token' })
  accessToken: string;
}
