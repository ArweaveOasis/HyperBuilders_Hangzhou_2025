import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';

describe('Canvas (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let sessionId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Clean database
    await prisma.canvasEdge.deleteMany();
    await prisma.canvasNode.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();

    // Create test user and get auth token
    const registerResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        handle: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

    authToken = registerResponse.body.data.accessToken;

    // Create test session
    const sessionResponse = await request(app.getHttpServer())
      .post('/api/sessions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Session',
      });

    sessionId = sessionResponse.body.data.id;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/canvas/nodes (POST)', () => {
    it('should create a canvas node', () => {
      return request(app.getHttpServer())
        .post('/api/canvas/nodes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sessionId,
          kind: 'idea',
          title: 'Test Idea',
          x: 100,
          y: 200,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.kind).toBe('idea');
          expect(res.body.data.title).toBe('Test Idea');
          expect(res.body.data.x).toBe(100);
          expect(res.body.data.y).toBe(200);
        });
    });
  });

  describe('/canvas/expand (POST)', () => {
    let nodeId: string;

    beforeEach(async () => {
      // Create a base node
      const nodeResponse = await request(app.getHttpServer())
        .post('/api/canvas/nodes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sessionId,
          kind: 'idea',
          title: 'Base Idea',
          x: 0,
          y: 0,
        });

      nodeId = nodeResponse.body.data.id;
    });

    it('should expand canvas to the right (time)', () => {
      return request(app.getHttpServer())
        .post('/api/canvas/expand')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          baseNodeId: nodeId,
          direction: 'right',
          intent: 'time',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.node).toBeDefined();
          expect(res.body.data.edge).toBeDefined();
          expect(res.body.data.edge.relation).toBe('time');
          expect(res.body.data.node.x).toBe(600); // 0 + 600 offset
          expect(res.body.data.node.y).toBe(0);   // 0 + 0 offset
        });
    });

    it('should expand canvas upward (summary)', () => {
      return request(app.getHttpServer())
        .post('/api/canvas/expand')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          baseNodeId: nodeId,
          direction: 'up',
          intent: 'summary',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.edge.relation).toBe('summary');
          expect(res.body.data.node.x).toBe(0);    // 0 + 0 offset
          expect(res.body.data.node.y).toBe(-400); // 0 + -400 offset
        });
    });

    it('should expand canvas downward (detail)', () => {
      return request(app.getHttpServer())
        .post('/api/canvas/expand')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          baseNodeId: nodeId,
          direction: 'down',
          intent: 'detail',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.edge.relation).toBe('detail');
          expect(res.body.data.node.x).toBe(0);   // 0 + 0 offset
          expect(res.body.data.node.y).toBe(400); // 0 + 400 offset
        });
    });

    it('should expand canvas to the left (contrast)', () => {
      return request(app.getHttpServer())
        .post('/api/canvas/expand')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          baseNodeId: nodeId,
          direction: 'left',
          intent: 'contrast',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.edge.relation).toBe('contrast');
          expect(res.body.data.node.x).toBe(-600); // 0 + -600 offset
          expect(res.body.data.node.y).toBe(0);    // 0 + 0 offset
        });
    });

    it('should reject invalid direction-intent mapping', () => {
      return request(app.getHttpServer())
        .post('/api/canvas/expand')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          baseNodeId: nodeId,
          direction: 'right',
          intent: 'summary', // Wrong! right should map to time
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toContain('Invalid direction-intent mapping');
        });
    });
  });

  describe('/canvas/sessions/:id (GET)', () => {
    it('should get session canvas', async () => {
      // Create some nodes and edges
      const node1Response = await request(app.getHttpServer())
        .post('/api/canvas/nodes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sessionId,
          kind: 'idea',
          title: 'Node 1',
          x: 0,
          y: 0,
        });

      const node2Response = await request(app.getHttpServer())
        .post('/api/canvas/nodes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sessionId,
          kind: 'idea',
          title: 'Node 2',
          x: 100,
          y: 100,
        });

      // Create edge
      await request(app.getHttpServer())
        .post('/api/canvas/edges')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sessionId,
          fromNodeId: node1Response.body.data.id,
          toNodeId: node2Response.body.data.id,
          relation: 'time',
        });

      return request(app.getHttpServer())
        .get(`/api/canvas/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.nodes).toHaveLength(2);
          expect(res.body.data.edges).toHaveLength(1);
        });
    });
  });
});
