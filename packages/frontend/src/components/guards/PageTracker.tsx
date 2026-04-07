import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../../lib/analytics';

/**
 * Component that automatically tracks page views on route changes.
 * Must be rendered inside a <BrowserRouter>.
 */
export function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    // Standardize title or path for tracking
    const path = location.pathname;
    const title = getTitleByPath(path);
    
    trackPageView(path, title);
  }, [location]);

  return null;
}

function getTitleByPath(path: string): string {
  const routes: Record<string, string> = {
    '/': 'Home',
    '/login': 'Login',
    '/forgot-password': 'Recuperar Contraseña',
    '/estudiantes': 'Estudiantes',
    '/usuarios': 'Usuarios',
    '/cursos': 'Cursos',
    '/horarios': 'Horarios',
    '/mi-perfil': 'Mi Perfil',
    '/mis-clases': 'Mis Clases',
    '/departamentos': 'Departamentos',
    '/aulas': 'Aulas',
  };

  if (routes[path]) return routes[path];
  
  // Dynamic routes or fallbacks
  if (path.startsWith('/estudiantes/') && path.endsWith('/editar')) return 'Editar Estudiante';
  if (path.startsWith('/horarios/') && path.endsWith('/editar')) return 'Editar Horario';
  
  return 'Academic App';
}
