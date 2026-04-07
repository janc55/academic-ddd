import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '../../templates/MainLayout';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { forgotPassword, verifyCode, resetPassword } from '../../../services/authService';
import { trackEvent, trackPageView } from '../../../lib/analytics';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (typeof window !== 'undefined') {
    trackPageView('/forgot-password', `Forgot Password - Step ${step}`);
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess('Código enviado correctamente. Revisa la consola del servidor.');
      setStep(2);
      trackEvent('forgot_password_request', { email });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await verifyCode(email, code);
      if (result.valid) {
        setStep(3);
        setSuccess(null);
      } else {
        setError('Código inválido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email, code, password);
      setSuccess('Contraseña actualizada correctamente. Redirigiendo al login...');
      trackEvent('password_reset_success', { email });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm ring-1 ring-slate-200/50 dark:border-slate-600 dark:bg-slate-800/95 dark:ring-slate-600/50 sm:p-10 max-w-md mx-auto">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {step === 1 && 'Recuperar contraseña'}
          {step === 2 && 'Verificar código'}
          {step === 3 && 'Nueva contraseña'}
        </h2>
        
        <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm">
          {step === 1 && 'Ingresa tu correo electrónico para recibir un código de recuperación.'}
          {step === 2 && `Hemos enviado un código al correo ${email}.`}
          {step === 3 && 'Ingresa tu nueva contraseña para acceder a tu cuenta.'}
        </p>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 dark:text-red-300 dark:bg-red-900/30 rounded-lg px-3 py-2 border border-red-100 dark:border-red-800">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 text-sm text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-900/30 rounded-lg px-3 py-2 border border-emerald-100 dark:border-emerald-800">
            {success}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendCode} className="mt-6 space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Correo electrónico
              </label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
              />
            </div>
            <div className="flex flex-col gap-3 pt-1">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Enviando...' : 'Enviar código'}
              </Button>
              <Link to="/login" className="text-sm text-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                Volver al login
              </Link>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="mt-6 space-y-5">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Código de verificación
              </label>
              <Input
                id="code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className="text-center tracking-widest text-lg font-mono"
              />
            </div>
            <div className="flex flex-col gap-3 pt-1">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Verificando...' : 'Verificar código'}
              </Button>
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="text-sm text-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                disabled={loading}
              >
                Cambiar correo
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="mt-6 space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Nueva contraseña
              </label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Confirmar nueva contraseña
              </label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Actualizando...' : 'Restablecer contraseña'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </MainLayout>
  );
}
