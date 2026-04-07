import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/domain/user.entity';
import { UserService } from '../../users/application/user.service';
import { RoleService } from '../../roles/application/role.service';
import type { JwtPayload } from '../infrastructure/jwt.payload';

export type LoginResult = {
  id: string;
  username: string;
  email: string;
  role: string;
};

export type LoginResponse = {
  access_token: string;
  user: LoginResult;
};

@Injectable()
export class AuthService {
  private resetCodes = new Map<string, { code: string; expires: number }>();

  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
  ) {}

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      // Don't leak user existence? Or fine for this school project.
      // We'll just return as if it was sent if we want to be secure,
      // but usually for internal tools/school projects we can throw.
      throw new UnauthorizedException('Email no encontrado');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    this.resetCodes.set(email.toLowerCase(), { code, expires });

    console.log(`[SIMULATED EMAIL] Para: ${email} - Código: ${code}`);
  }

  async verifyCode(email: string, code: string): Promise<boolean> {
    const data = this.resetCodes.get(email.toLowerCase());
    if (!data) return false;
    if (data.expires < Date.now()) {
      this.resetCodes.delete(email.toLowerCase());
      return false;
    }
    return data.code === code;
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    const isValid = await this.verifyCode(email, code);
    if (!isValid) {
      throw new UnauthorizedException('Código inválido o expirado');
    }

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    await this.userService.resetPassword(user.id, newPassword);
    this.resetCodes.delete(email.toLowerCase());
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const valid = await this.userService.verifyPassword(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const loginResult = await this.toLoginResult(user);
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: loginResult.role,
    };
    const access_token = this.jwtService.sign(payload);
    return { access_token, user: loginResult };
  }

  private async toLoginResult(user: User): Promise<LoginResult> {
    const role = await this.roleService.findById(user.roleId);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: role?.name ?? 'STUDENT',
    };
  }
}
