import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
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

@Injectable()
export class CanvasService {
  constructor(private prisma: PrismaService) {}

  async createNode(userId: string, createNodeDto: CreateCanvasNodeDto): Promise<CanvasNodeResponseDto> {
    // Verify user owns the session
    const session = await this.prisma.session.findFirst({
      where: {
        id: createNodeDto.sessionId,
        userId,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const node = await this.prisma.canvasNode.create({
      data: {
        sessionId: createNodeDto.sessionId,
        kind: createNodeDto.kind,
        title: createNodeDto.title,
        contentRef: createNodeDto.contentRef,
        x: createNodeDto.x,
        y: createNodeDto.y,
        layout: createNodeDto.layout,
      },
    });

    return node;
  }

  async createEdge(userId: string, createEdgeDto: CreateCanvasEdgeDto): Promise<CanvasEdgeResponseDto> {
    // Verify user owns the session
    const session = await this.prisma.session.findFirst({
      where: {
        id: createEdgeDto.sessionId,
        userId,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Verify both nodes exist and belong to the session
    const nodes = await this.prisma.canvasNode.findMany({
      where: {
        id: { in: [createEdgeDto.fromNodeId, createEdgeDto.toNodeId] },
        sessionId: createEdgeDto.sessionId,
      },
    });

    if (nodes.length !== 2) {
      throw new BadRequestException('One or both nodes not found');
    }

    const edge = await this.prisma.canvasEdge.create({
      data: {
        sessionId: createEdgeDto.sessionId,
        fromNodeId: createEdgeDto.fromNodeId,
        toNodeId: createEdgeDto.toNodeId,
        relation: createEdgeDto.relation,
        meta: createEdgeDto.meta,
      },
    });

    return edge;
  }

  async expandCanvas(userId: string, expandDto: ExpandCanvasDto): Promise<ExpandCanvasResponseDto> {
    // Get the base node and verify ownership
    const baseNode = await this.prisma.canvasNode.findFirst({
      where: {
        id: expandDto.baseNodeId,
        session: {
          userId,
        },
      },
      include: {
        session: true,
      },
    });

    if (!baseNode) {
      throw new NotFoundException('Base node not found');
    }

    // Calculate new node position based on direction
    const directionOffsets = {
      [CanvasDirection.RIGHT]: { x: 600, y: 0 },
      [CanvasDirection.UP]: { x: 0, y: -400 },
      [CanvasDirection.DOWN]: { x: 0, y: 400 },
      [CanvasDirection.LEFT]: { x: -600, y: 0 },
    };

    const offset = directionOffsets[expandDto.direction];
    const newX = baseNode.x + offset.x;
    const newY = baseNode.y + offset.y;

    // Create new node
    const newNode = await this.prisma.canvasNode.create({
      data: {
        sessionId: baseNode.sessionId,
        kind: 'expanded',
        title: `Expanded ${expandDto.direction}`,
        x: newX,
        y: newY,
        layout: {
          w: 200,
          h: 100,
          color: '#f0f0f0',
        },
      },
    });

    // Create edge connecting base node to new node
    const newEdge = await this.prisma.canvasEdge.create({
      data: {
        sessionId: baseNode.sessionId,
        fromNodeId: expandDto.baseNodeId,
        toNodeId: newNode.id,
        relation: expandDto.intent,
        meta: {
          direction: expandDto.direction,
        },
      },
    });

    return {
      node: newNode,
      edge: newEdge,
    };
  }

  async getSessionCanvas(sessionId: string, userId: string): Promise<{ nodes: CanvasNodeResponseDto[], edges: CanvasEdgeResponseDto[] }> {
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

    const [nodes, edges] = await Promise.all([
      this.prisma.canvasNode.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.canvasEdge.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    return { nodes, edges };
  }
}
