import { apiRequest } from '../lib';
import type {
  ChangePasswordDto,
  ChangePasswordResponse,
  LoginResponse,
} from '../entities';

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  try {
    return await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: username.trim(), password }),
      defaultErrorMessage: 'Error al iniciar sesión',
    });
  } catch (err) {
    const message =
      err instanceof Error && err.message === 'Credenciales inválidas'
        ? 'Usuario o contraseña incorrectos'
        : err instanceof Error
          ? err.message
          : 'Error al iniciar sesión';
    throw new Error(message);
  }
}

export async function changePassword(
  payload: ChangePasswordDto,
): Promise<ChangePasswordResponse> {
  try {
    return await apiRequest<ChangePasswordResponse>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(payload),
      defaultErrorMessage: 'No se pudo cambiar la contraseña',
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'No se pudo cambiar la contraseña';
    throw new Error(message);
  }
}

export async function forgotPassword(email: string): Promise<void> {
  await apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim() }),
    defaultErrorMessage: 'No se pudo solicitar el código de recuperación',
  });
}

export async function verifyCode(
  email: string,
  code: string,
) {
  return await apiRequest<{ message: string; valid: boolean }>(
    '/auth/verify-code',
    {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), code: code.trim() }),
      defaultErrorMessage: 'Código inválido o expirado',
    },
  );
}

export async function resetPassword(
  email: string,
  code: string,
  password: string,
) {
  await apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim(), code: code.trim(), password }),
    defaultErrorMessage: 'No se pudo actualizar la contraseña',
  });
}
