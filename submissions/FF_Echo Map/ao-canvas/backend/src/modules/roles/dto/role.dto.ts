import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, IsObject } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: 'Role name', example: 'Rational Analyst' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ description: 'Role persona/description', example: 'A logical, data-driven analyst who supports AI advancement' })
  @IsString()
  @MinLength(1)
  persona: string;

  @ApiPropertyOptional({ description: 'Avatar URL', example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ description: 'AI model parameters' })
  @IsOptional()
  @IsObject()
  params?: {
    model: string;
    temperature: number;
    top_p: number;
    max_tokens: number;
  };

  @ApiPropertyOptional({ description: 'Provenance information' })
  @IsOptional()
  @IsString()
  provenance?: string;
}

export class RoleResponseDto {
  @ApiProperty({ description: 'Role ID' })
  id: string;

  @ApiProperty({ description: 'Session ID' })
  sessionId: string;

  @ApiProperty({ description: 'Role name' })
  name: string;

  @ApiProperty({ description: 'Role persona' })
  persona: string;

  @ApiPropertyOptional({ description: 'Avatar URL' })
  avatarUrl?: string;

  @ApiPropertyOptional({ description: 'AI parameters' })
  params?: any;

  @ApiPropertyOptional({ description: 'Provenance' })
  provenance?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
