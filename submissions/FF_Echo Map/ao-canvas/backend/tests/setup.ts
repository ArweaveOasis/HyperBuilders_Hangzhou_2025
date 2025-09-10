import { beforeAll, afterAll } from 'vitest';
import { PrismaService } from '../src/common/prisma/prisma.service';

let prisma: PrismaService;

beforeAll(async () => {
  prisma = new PrismaService();
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };
