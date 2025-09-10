import { describe, it, expect, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Clean database
    await prisma.user.deleteMany();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          handle: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.user.handle).toBe('testuser');
          expect(res.body.data.accessToken).toBeDefined();
        });
    });

    it('should reject duplicate handle', async () => {
      // First registration
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          handle: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(201);

      // Second registration with same handle
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          handle: 'testuser',
          email: 'test2@example.com',
          password: 'password123',
        })
        .expect(409);
    });
  });

  describe('/auth/login (POST)', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          handle: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        });
    });

    it('should login with handle', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          identifier: 'testuser',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.user.handle).toBe('testuser');
          expect(res.body.data.accessToken).toBeDefined();
        });
    });

    it('should login with email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          identifier: 'test@example.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.user.email).toBe('test@example.com');
        });
    });

    it('should reject invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          identifier: 'testuser',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });
});
