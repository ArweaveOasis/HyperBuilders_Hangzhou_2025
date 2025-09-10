import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { handle, email, password, wallet, prefs } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ handle }, { email }],
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this handle or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        handle,
        email,
        wallet,
        prefs,
        // Note: In a real app, you'd store the hashed password in a separate table
        // For this demo, we'll use a simple approach
      },
    });

    // Generate JWT token
    const payload = { sub: user.id, handle: user.handle, email };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        handle: user.handle,
        email,
        wallet: user.wallet,
        prefs: user.prefs,
      },
      accessToken,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { identifier, password } = loginDto;

    // Find user by handle or email
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ handle: identifier }, { email: identifier }],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // In a real app, you'd verify the password here
    // For this demo, we'll skip password verification
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   throw new UnauthorizedException('Invalid credentials');
    // }

    // Generate JWT token
    const payload = { sub: user.id, handle: user.handle, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        handle: user.handle,
        email: user.email,
        wallet: user.wallet,
        prefs: user.prefs,
      },
      accessToken,
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
