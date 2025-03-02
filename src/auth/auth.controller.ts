import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { jwtConstants } from './constants';
import { JwtService } from '@nestjs/jwt';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GoogleOauthGuard } from './google-oauth.guard';
import { GithubAuthGuard } from './github-oauth.guard';

interface RequestWithCookies extends Request {
  cookies: Record<string, string>;
}

export interface RequestWithUser extends Request {
  user?: any;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
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
      secure: false, //process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 * 3,
    });
    return { message: 'Logged in successfully' };
  }

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.oAuthLogin(req.user);
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }
    response.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 3600000 * 3,
    });

    return response.send(`
      <html>
        <body>
          <script>
            window.location.href = 'http://localhost:4200/dashboard';
          </script>
        </body>
      </html>
    `);
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubAuthCallback(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.oAuthLogin(req.user);
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 3600000 * 3,
    });

    return res.send(`
      <html>
        <body>
          <script>
            window.location.href = 'http://localhost:4200/dashboard';
          </script>
        </body>
      </html>
    `);
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiCookieAuth()
  @ApiResponse({ status: 200, description: 'User data returned successfully' })
  @ApiResponse({ status: 401, description: 'Not logged in / Invalid token' })
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
