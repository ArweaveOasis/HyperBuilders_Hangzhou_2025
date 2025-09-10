import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { RolesModule } from './modules/roles/roles.module';
import { DebatesModule } from './modules/debates/debates.module';
import { IdeasModule } from './modules/ideas/ideas.module';
import { ReflectionsModule } from './modules/reflections/reflections.module';
import { CanvasModule } from './modules/canvas/canvas.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL || '60') * 1000,
        limit: parseInt(process.env.THROTTLE_LIMIT || '100'),
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    SessionsModule,
    RolesModule,
    DebatesModule,
    IdeasModule,
    ReflectionsModule,
    CanvasModule,
    HealthModule,
  ],
})
export class AppModule {}
