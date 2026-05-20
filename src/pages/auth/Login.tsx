import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { MdEmail, MdLock, MdPerson, MdLocalHospital } from 'react-icons/md';
import { LoginFormValues, loginSchema } from '@/schemas/donor';
import axios from 'axios';
import { useAuth } from '@/service/donor/login';
import { useHospitalLogin } from '@/service/hospital/hospital';
import { useAuthStore } from '@/hooks/auth';
import { useHospitalAuthStore } from '@/hooks/hospitalAuth';

export type Role = 'donor' | 'hospital';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState<Role>('donor');
  const [serverError, setServerError] = useState<string | null>(null);

  // Stores
  const setAuth = useAuthStore((state) => state.setAuth);
  const { loginHospital } = useHospitalAuthStore();

  // Form — partilhado entre os dois roles (mesmos campos: email + senha)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', senha: '' },
  });

  // Mutations
  const { mutateAsync: authLogin } = useAuth();
  const { mutateAsync: hospitalLogin } = useHospitalLogin();

  const handleRoleChange = (role: Role) => {
    setActiveRole(role);
    setServerError(null);
  };

  // ── Submit unificado — chama o endpoint certo conforme o role ─────────────
  const onSubmit = async (data: LoginFormValues): Promise<void> => {
    setServerError(null);

    try {
      if (activeRole === 'donor') {
        const response = await authLogin(data);

        setAuth({
          ...response,
          role: 'donor',
        });

        navigate('/donor/dashboard');
        return;
      }

      // ── Hospital ──────────────────────────────────────────────────────────
      const response = await hospitalLogin({
        email: data.email,
        senha: data.senha,
      });

      // Guarda token nos cookies via Zustand persist
      loginHospital(response.token, response.user);

      navigate('/hospital/dashboard');
    } catch (err) {
      setServerError(resolveAxiosError(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors duration-500">
      {/* Blobs decorativos */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-40 -right-40 w-80 h-80 sm:w-[480px] sm:h-[480px] rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 sm:w-[480px] sm:h-[480px] rounded-full bg-rose-500/5 dark:bg-rose-500/10 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-sm sm:max-w-md border-none shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
        <CardHeader className="text-center space-y-3 pb-4 px-5 sm:px-8 pt-8">
          <div className="mx-auto size-14 sm:size-16 bg-primary/10 dark:bg-primary/20 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-2">
            <span className="text-primary text-2xl sm:text-3xl font-black tracking-tighter">
              B+
            </span>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Bem-vindo de volta
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Faça login na sua conta para continuar.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 px-5 sm:px-8 pb-8">
          {/* Selector de role */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <RoleButton
              active={activeRole === 'donor'}
              onClick={() => handleRoleChange('donor')}
              icon={<MdPerson className="text-lg sm:text-xl shrink-0" />}
              label="Doador"
              colorClass="text-primary"
            />
            <RoleButton
              active={activeRole === 'hospital'}
              onClick={() => handleRoleChange('hospital')}
              icon={<MdLocalHospital className="text-lg sm:text-xl shrink-0" />}
              label="Hospital"
              colorClass="text-blue-600 dark:text-blue-400"
            />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {/* Erro do servidor */}
            {serverError && (
              <div
                role="alert"
                className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              >
                <span className="text-red-500 text-xs font-bold mt-0.5">⚠</span>
                <p className="text-red-600 dark:text-red-400 text-xs font-semibold">
                  {serverError}
                </p>
              </div>
            )}

            {/* Email */}
            <FormField
              label="E-mail"
              error={errors.email?.message}
              errorId="login-email-error"
              icon={
                <MdEmail
                  className={cn(
                    'absolute left-4 top-1/2 -translate-y-1/2 text-xl transition-colors',
                    errors.email
                      ? 'text-red-500'
                      : activeRole === 'hospital'
                        ? 'text-slate-400 group-focus-within:text-blue-500'
                        : 'text-slate-400 group-focus-within:text-primary'
                  )}
                  aria-hidden="true"
                />
              }
            >
              <input
                {...register('email')}
                type="email"
                id="login-email"
                autoComplete="email"
                className={cn(
                  'w-full bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl py-3.5 sm:py-4 pl-12 pr-4 outline-none transition-all font-medium text-slate-900 dark:text-white text-sm sm:text-base placeholder:text-slate-400',
                  errors.email
                    ? 'border-red-200 dark:border-red-900/50 focus:border-red-500'
                    : activeRole === 'hospital'
                      ? 'border-transparent focus:border-blue-400/40 focus:bg-white dark:focus:bg-slate-900'
                      : 'border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-900'
                )}
                placeholder="nome@exemplo.com"
                aria-describedby={
                  errors.email ? 'login-email-error' : undefined
                }
                aria-invalid={!!errors.email}
              />
            </FormField>

            {/* Senha */}
            <FormField
              label="Senha"
              error={errors.senha?.message}
              errorId="login-password-error"
              icon={
                <MdLock
                  className={cn(
                    'absolute left-4 top-1/2 -translate-y-1/2 text-xl transition-colors',
                    errors.senha
                      ? 'text-red-500'
                      : activeRole === 'hospital'
                        ? 'text-slate-400 group-focus-within:text-blue-500'
                        : 'text-slate-400 group-focus-within:text-primary'
                  )}
                  aria-hidden="true"
                />
              }
            >
              <input
                {...register('senha')}
                type="password"
                id="login-senha"
                autoComplete="current-password"
                className={cn(
                  'w-full bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl py-3.5 sm:py-4 pl-12 pr-4 outline-none transition-all font-medium text-slate-900 dark:text-white text-sm sm:text-base placeholder:text-slate-400',
                  errors.senha
                    ? 'border-red-200 dark:border-red-900/50 focus:border-red-500'
                    : activeRole === 'hospital'
                      ? 'border-transparent focus:border-blue-400/40 focus:bg-white dark:focus:bg-slate-900'
                      : 'border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-900'
                )}
                placeholder="••••••••"
                aria-describedby={
                  errors.senha ? 'login-senha-error' : undefined
                }
                aria-invalid={!!errors.senha}
              />
            </FormField>

            {/* Botão */}
            <Button
              type="submit"
              className={cn(
                'w-full py-6 sm:py-7 text-base sm:text-lg rounded-2xl mt-2 font-bold transition-all duration-200',
                activeRole === 'hospital'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20'
                  : 'shadow-lg shadow-primary/20'
              )}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner />
                  Verificando conta...
                </span>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium pt-1">
            Não tem uma conta?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-primary font-black hover:underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              Criar uma
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

/* ─── Utilitário de erros Axios ──────────────────────────────────────────── */

function resolveAxiosError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    if (status === 401) return 'Email ou senha incorrectos. Tente novamente.';
    if (status === 404) return 'Conta não encontrada. Verifique o email.';
    if (status === 403) return 'Conta desactivada. Contacte o suporte.';
    if (!err.response)
      return 'Sem ligação ao servidor. Verifique a sua internet.';
    return 'Ocorreu um erro. Tente novamente mais tarde.';
  }
  return 'Erro inesperado. Tente novamente.';
}

/* ─── Sub-componentes ────────────────────────────────────────────────────── */

interface RoleButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  colorClass: string;
}

const RoleButton: React.FC<RoleButtonProps> = ({
  active,
  onClick,
  icon,
  label,
  colorClass,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-200',
      active
        ? `bg-white dark:bg-slate-700 shadow-sm ${colorClass} scale-[1.02]`
        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
    )}
    aria-pressed={active}
  >
    {icon}
    <span>{label}</span>
  </button>
);

interface FormFieldProps {
  label: string;
  error?: string;
  errorId?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  errorId,
  icon,
  children,
}) => (
  <div className="space-y-1.5">
    <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1 block">
      {label}
    </label>
    <div className="relative group">
      {icon}
      {children}
    </div>
    {error && (
      <p
        id={errorId}
        role="alert"
        className="text-red-500 text-[10px] font-black uppercase tracking-wide ml-1"
      >
        {error}
      </p>
    )}
  </div>
);

const LoadingSpinner: React.FC = () => (
  <svg
    className="animate-spin h-4 w-4 text-current"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);
