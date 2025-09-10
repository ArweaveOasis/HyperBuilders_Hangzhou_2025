import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsObject, IsEnum, MinLength } from 'class-validator';

export enum CanvasDirection {
  RIGHT = 'right',
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
}

export enum CanvasRelation {
  TIME = 'time',
  SUMMARY = 'summary',
  DETAIL = 'detail',
  CONTRAST = 'contrast',
}

export class CreateCanvasNodeDto {
  @ApiProperty({ description: 'Session ID' })
  @IsString()
  sessionId: string;

  @ApiProperty({ description: 'Node kind', example: 'idea' })
  @IsString()
  @MinLength(1)
  kind: string;

  @ApiPropertyOptional({ description: 'Node title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Content reference' })
  @IsOptional()
  @IsObject()
  contentRef?: {
    type: string;
    id?: string;
    externalUrl?: string;
    cid?: string;
  };

  @ApiProperty({ description: 'X coordinate' })
  @IsNumber()
  x: number;

  @ApiProperty({ description: 'Y coordinate' })
  @IsNumber()
  y: number;

  @ApiPropertyOptional({ description: 'Layout properties' })
  @IsOptional()
  @IsObject()
  layout?: {
    w?: number;
    h?: number;
    color?: string;
  };
}

export class CreateCanvasEdgeDto {
  @ApiProperty({ description: 'Session ID' })
  @IsString()
  sessionId: string;

  @ApiProperty({ description: 'From node ID' })
  @IsString()
  fromNodeId: string;

  @ApiProperty({ description: 'To node ID' })
  @IsString()
  toNodeId: string;

  @ApiProperty({ description: 'Relation type', enum: CanvasRelation })
  @IsEnum(CanvasRelation)
  relation: CanvasRelation;

  @ApiPropertyOptional({ description: 'Edge metadata' })
  @IsOptional()
  @IsObject()
  meta?: {
    direction?: string;
  };
}

export class ExpandCanvasDto {
  @ApiProperty({ description: 'Base node ID' })
  @IsString()
  baseNodeId: string;

  @ApiProperty({ description: 'Direction', enum: CanvasDirection })
  @IsEnum(CanvasDirection)
  direction: CanvasDirection;

  @ApiProperty({ description: 'Intent', enum: CanvasRelation })
  @IsEnum(CanvasRelation)
  intent: CanvasRelation;

  @ApiPropertyOptional({ description: 'Additional payload' })
  @IsOptional()
  @IsObject()
  payload?: any;
}

export class CanvasNodeResponseDto {
  @ApiProperty({ description: 'Node ID' })
  id: string;

  @ApiProperty({ description: 'Session ID' })
  sessionId: string;

  @ApiProperty({ description: 'Node kind' })
  kind: string;

  @ApiPropertyOptional({ description: 'Node title' })
  title?: string;

  @ApiPropertyOptional({ description: 'Content reference' })
  contentRef?: any;

  @ApiProperty({ description: 'X coordinate' })
  x: number;

  @ApiProperty({ description: 'Y coordinate' })
  y: number;

  @ApiPropertyOptional({ description: 'Layout properties' })
  layout?: any;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export class CanvasEdgeResponseDto {
  @ApiProperty({ description: 'Edge ID' })
  id: string;

  @ApiProperty({ description: 'Session ID' })
  sessionId: string;

  @ApiProperty({ description: 'From node ID' })
  fromNodeId: string;

  @ApiProperty({ description: 'To node ID' })
  toNodeId: string;

  @ApiProperty({ description: 'Relation type' })
  relation: string;

  @ApiPropertyOptional({ description: 'Edge metadata' })
  meta?: any;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;
}

export class ExpandCanvasResponseDto {
  @ApiProperty({ description: 'New node created' })
  node: CanvasNodeResponseDto;

  @ApiProperty({ description: 'New edge created' })
  edge: CanvasEdgeResponseDto;
}
