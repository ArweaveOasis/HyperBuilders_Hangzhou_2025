import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateSessionDto, SessionResponseDto } from './dto/session.dto';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async createSession(userId: string, createSessionDto: CreateSessionDto): Promise<SessionResponseDto> {
    const session = await this.prisma.session.create({
      data: {
        userId,
        title: createSessionDto.title,
      },
    });

    return session;
  }

  async getSession(sessionId: string, userId: string): Promise<SessionResponseDto> {
    const session = await this.prisma.session.findFirst({
      where: {
        id: sessionId,
        userId,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }
}
