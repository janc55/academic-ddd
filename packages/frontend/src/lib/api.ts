import { getAuthHeaders } from '../stores';

// const getBaseUrl = (): string =>
//   import.meta.env.VITE_API_BASE ?? 'http://localhost:3000';

// async function handleErrorResponse(
//   res: Response,
//   defaultMessage: string,
// ): Promise<never> {
//   if (res.status === 401) {
//     const { useAuthStore } = await import('../stores');
//     useAuthStore.getState().clearAuth();
//   }
//   const err = await res.json().catch(() => ({ message: res.statusText }));
//   throw new Error(err.message ?? defaultMessage);
// }

export type RequestOptions = RequestInit & {
  defaultErrorMessage?: string;
};

/**
 * Wrapper para llamadas al API backend.
 * Añade base URL, cabecera Authorization con JWT y maneja 401 (cierra sesión).
 */
export async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');

  const res = await fetch(`http://localhost:3000${url}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: options.body,
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('No autorizado');
    }
    throw new Error('Error');
  }

  return res.json();
}

/** Cabeceras con JWT para peticiones que no pasan por apiRequest (re-export desde store). */
export { getAuthHeaders };
