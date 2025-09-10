import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto, RoleResponseDto } from './dto/role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiResponseDto, PaginatedResponseDto } from '../../common/dto/api-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully', type: RoleResponseDto })
  async createRole(
    @Body() createRoleDto: CreateRoleDto,
    @CurrentUser() user: any,
  ): Promise<ApiResponseDto<RoleResponseDto>> {
    const role = await this.rolesService.createRole(user.id, createRoleDto);
    return new ApiResponseDto(role, 'Role created successfully');
  }

  @Get('sessions/:sessionId')
  @ApiOperation({ summary: 'Get roles for a session' })
  @ApiParam({ name: 'sessionId', description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'Roles retrieved successfully' })
  async getSessionRoles(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: any,
  ): Promise<ApiResponseDto<RoleResponseDto[]>> {
    const roles = await this.rolesService.getSessionRoles(sessionId, user.id);
    return new ApiResponseDto(roles, 'Roles retrieved successfully');
  }
}
