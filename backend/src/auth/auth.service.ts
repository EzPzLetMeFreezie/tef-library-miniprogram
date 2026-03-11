import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { WechatService } from './wechat.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly wechatService: WechatService,
  ) {}

  async login(loginDto: LoginDto) {
    const openid = await this.wechatService.code2Session(loginDto.code);
    if (!openid) {
      throw new UnauthorizedException('Invalid WeChat login code');
    }

    let user = await this.prisma.user.findUnique({ where: { openid } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          openid,
          name: loginDto.nickname || 'WeChat User',
          avatarUrl: loginDto.avatarUrl,
        },
      });
    } else if (loginDto.nickname || loginDto.avatarUrl) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          ...(loginDto.nickname && { name: loginDto.nickname }),
          ...(loginDto.avatarUrl && { avatarUrl: loginDto.avatarUrl }),
        },
      });
    }

    const payload = { sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
