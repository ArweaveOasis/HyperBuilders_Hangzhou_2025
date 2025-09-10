import { Controller, Post, Get, Body, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CanvasService } from './canvas.service';
import { 
  CreateCanvasNodeDto, 
  CreateCanvasEdgeDto, 
  ExpandCanvasDto,
  CanvasNodeResponseDto,
  CanvasEdgeResponseDto,
  ExpandCanvasResponseDto,
  CanvasDirection,
  CanvasRelation
} from './dto/canvas.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiResponseDto } from '../../common/dto/api-response.dto';

@ApiTags('Canvas')
@Controller('canvas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CanvasController {
  constructor(private readonly canvasService: CanvasService) {}

  @Post('nodes')
  @ApiOperation({ summary: 'Create a canvas node' })
  @ApiResponse({ status: 201, description: 'Node created successfully', type: CanvasNodeResponseDto })
  async createNode(
    @Body() createNodeDto: CreateCanvasNodeDto,
    @CurrentUser() user: any,
  ): Promise<ApiResponseDto<CanvasNodeResponseDto>> {
    const node = await this.canvasService.createNode(user.id, createNodeDto);
    return new ApiResponseDto(node, 'Node created successfully');
  }

  @Post('edges')
  @ApiOperation({ summary: 'Create a canvas edge' })
  @ApiResponse({ status: 201, description: 'Edge created successfully', type: CanvasEdgeResponseDto })
  async createEdge(
    @Body() createEdgeDto: CreateCanvasEdgeDto,
    @CurrentUser() user: any,
  ): Promise<ApiResponseDto<CanvasEdgeResponseDto>> {
    const edge = await this.canvasService.createEdge(user.id, createEdgeDto);
    return new ApiResponseDto(edge, 'Edge created successfully');
  }

  @Post('expand')
  @ApiOperation({ summary: 'Expand canvas in a specific direction' })
  @ApiResponse({ status: 201, description: 'Canvas expanded successfully', type: ExpandCanvasResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid direction or intent mapping' })
  async expandCanvas(
    @Body() expandDto: ExpandCanvasDto,
    @CurrentUser() user: any,
  ): Promise<ApiResponseDto<ExpandCanvasResponseDto>> {
    // Validate direction-intent mapping
    const validMappings = {
      [CanvasDirection.RIGHT]: CanvasRelation.TIME,
      [CanvasDirection.UP]: CanvasRelation.SUMMARY,
      [CanvasDirection.DOWN]: CanvasRelation.DETAIL,
      [CanvasDirection.LEFT]: CanvasRelation.CONTRAST,
    };

    if (validMappings[expandDto.direction] !== expandDto.intent) {
      throw new BadRequestException(
        `Invalid direction-intent mapping. ${expandDto.direction} should map to ${validMappings[expandDto.direction]}, not ${expandDto.intent}`
      );
    }

    const result = await this.canvasService.expandCanvas(user.id, expandDto);
    return new ApiResponseDto(result, 'Canvas expanded successfully');
  }

  @Get('sessions/:sessionId')
  @ApiOperation({ summary: 'Get canvas for a session' })
  @ApiParam({ name: 'sessionId', description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'Canvas retrieved successfully' })
  async getSessionCanvas(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: any,
  ): Promise<ApiResponseDto<{ nodes: CanvasNodeResponseDto[], edges: CanvasEdgeResponseDto[] }>> {
    const canvas = await this.canvasService.getSessionCanvas(sessionId, user.id);
    return new ApiResponseDto(canvas, 'Canvas retrieved successfully');
  }
}
