import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from '../../../contexts/identity-access/auth/application/auth.service';
import { Public } from '../../../contexts/identity-access/auth/infrastructure/public.decorator';

const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME ?? 'access_token';
<<<<<<< HEAD
=======
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN ?? undefined;
>>>>>>> 00efccea6476f5df81d3370e2033824234b5dd82

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
<<<<<<< HEAD
=======
  // throttle más agresivo configurado desde ThrottlerModule con key 'auth'
>>>>>>> 00efccea6476f5df81d3370e2033824234b5dd82
  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(
      body.username?.trim() ?? '',
      body.password ?? '',
    );

<<<<<<< HEAD
    // 🔥 CONFIG CORRECTA PARA DESARROLLO
    res.cookie(JWT_COOKIE_NAME, result.access_token, {
      httpOnly: true,
      secure: false,     // ❌ NO HTTPS
      sameSite: 'lax',   // ✅ CLAVE
      path: '/',
      maxAge: 2 * 60 * 60 * 1000,
=======
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie(JWT_COOKIE_NAME, result.access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'lax' : 'none',
      domain: COOKIE_DOMAIN,
      path: '/',
      maxAge: 2 * 60 * 60 * 1000, // 2h (match with JWT signOptions)
>>>>>>> 00efccea6476f5df81d3370e2033824234b5dd82
    });

    return result;
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 00efccea6476f5df81d3370e2033824234b5dd82
