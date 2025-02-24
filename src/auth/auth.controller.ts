import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { jwtConstants } from './constants';
import { JwtService } from '@nestjs/jwt';

interface RequestWithCookies extends Request {
  cookies: Record<string, string>;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginUserDto);
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }
    response.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 * 3,
    });
    return { message: 'Logged in successfully' };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  async getMe(@Req() req: RequestWithCookies) {
    const token = req.cookies['access_token'];
    if (!token) {
      throw new UnauthorizedException('Not logged in');
    }
    try {
      const payload = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });
      return { userId: payload.sub, email: payload.email, role: payload.role };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
