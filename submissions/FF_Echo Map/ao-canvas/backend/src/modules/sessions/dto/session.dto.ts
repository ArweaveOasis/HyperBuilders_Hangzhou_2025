import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateSessionDto {
  @ApiPropertyOptional({ description: 'Session title', example: 'AI Ethics Debate' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;
}

export class SessionResponseDto {
  @ApiProperty({ description: 'Session ID' })
  id: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiPropertyOptional({ description: 'Session title' })
  title?: string;

  @ApiPropertyOptional({ description: 'Root node ID' })
  rootNodeId?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
