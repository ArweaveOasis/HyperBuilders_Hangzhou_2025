import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { CreateSessionDto, SessionResponseDto } from './dto/session.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiResponseDto } from '../../common/dto/api-response.dto';

@ApiTags('Sessions')
@Controller('sessions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new session' })
  @ApiResponse({ status: 201, description: 'Session created successfully', type: SessionResponseDto })
  async createSession(
    @Body() createSessionDto: CreateSessionDto,
    @CurrentUser() user: any,
  ): Promise<ApiResponseDto<SessionResponseDto>> {
    const session = await this.sessionsService.createSession(user.id, createSessionDto);
    return new ApiResponseDto(session, 'Session created successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get session by ID' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'Session retrieved successfully', type: SessionResponseDto })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async getSession(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<ApiResponseDto<SessionResponseDto>> {
    const session = await this.sessionsService.getSession(id, user.id);
    return new ApiResponseDto(session, 'Session retrieved successfully');
  }
}
