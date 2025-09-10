import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateRoleDto, RoleResponseDto } from './dto/role.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async createRole(userId: string, createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    // For now, we'll create a role without a specific session
    // In a real app, you might want to require a sessionId
    const role = await this.prisma.role.create({
      data: {
        sessionId: 'temp-session', // This should be passed as a parameter
        name: createRoleDto.name,
        persona: createRoleDto.persona,
        avatarUrl: createRoleDto.avatarUrl,
        params: createRoleDto.params,
        provenance: createRoleDto.provenance,
      },
    });

    return role;
  }

  async getSessionRoles(sessionId: string, userId: string): Promise<RoleResponseDto[]> {
    // Verify user owns the session
    const session = await this.prisma.session.findFirst({
      where: {
        id: sessionId,
        userId,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const roles = await this.prisma.role.findMany({
      where: {
        sessionId,
      },
    });

    return roles;
  }
}
