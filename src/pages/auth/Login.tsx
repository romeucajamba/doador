import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';
import { MdEmail, MdLock, MdPerson, MdLocalHospital } from 'react-icons/md';

const loginSchema = z.object({
  email: z.string().email('Endereço de e-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['donor', 'hospital']),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type Role = 'donor' | 'hospital';

type DonorUser = {
  id: string;
  name: string;
  email: string;
  role: 'donor';
  bloodType: string;
  totalDonations: number;
  livesSaved: number;
  rank: string;
};

type HospitalUser = {
  id: string;
  name: string;
  email: string;
  role: 'hospital';
  address: string;
  phone: string;
  inventory: Record<string, unknown>;
};

type MockUser = DonorUser | HospitalUser;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [activeRole, setActiveRole] = useState<Role>('donor');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: 'donor' },
  });

  const handleRoleChange = (role: Role) => {
    setActiveRole(role);
    setValue('role', role);
  };

  const onSubmit = async (data: LoginFormValues): Promise<void> => {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockUser: MockUser =
          data.role === 'donor'
            ? {
                id: 'd1',
                name: 'Miguel Silva',
                email: data.email,
                role: 'donor',
                bloodType: 'O+',
                totalDonations: 12,
                livesSaved: 36,
                rank: 'Bronze',
              }
            : {
                id: 'h1',
                name: "St. Luke's Hospital",
                email: data.email,
                role: 'hospital',
                address: 'Rua da Independência, Luanda',
                phone: '+244 923 000 000',
                inventory: {},
              };

        login(mockUser);
        navigate(
          data.role === 'donor' ? '/donor/dashboard' : '/hospital/dashboard'
        );
        resolve();
      }, 1000);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors duration-500">
      {/* Background decorative blobs */}
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
          {/* Role Selection */}
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
            <input type="hidden" {...register('role')} value={activeRole} />

            {/* Email */}
            <FormField
              label="E-mail"
              error={errors.email?.message}
              icon={
                <MdEmail
                  className={cn(
                    'absolute left-4 top-1/2 -translate-y-1/2 text-xl transition-colors',
                    errors.email
                      ? 'text-red-500'
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
                    : 'border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-900'
                )}
                placeholder="nome@exemplo.com"
                aria-describedby={
                  errors.email ? 'login-email-error' : undefined
                }
                aria-invalid={!!errors.email}
              />
            </FormField>

            {/* Password */}
            <FormField
              label="Senha"
              error={errors.password?.message}
              errorId="login-password-error"
              icon={
                <MdLock
                  className={cn(
                    'absolute left-4 top-1/2 -translate-y-1/2 text-xl transition-colors',
                    errors.password
                      ? 'text-red-500'
                      : 'text-slate-400 group-focus-within:text-primary'
                  )}
                  aria-hidden="true"
                />
              }
            >
              <input
                {...register('password')}
                type="password"
                id="login-password"
                autoComplete="current-password"
                className={cn(
                  'w-full bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl py-3.5 sm:py-4 pl-12 pr-4 outline-none transition-all font-medium text-slate-900 dark:text-white text-sm sm:text-base placeholder:text-slate-400',
                  errors.password
                    ? 'border-red-200 dark:border-red-900/50 focus:border-red-500'
                    : 'border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-900'
                )}
                placeholder="••••••••"
                aria-describedby={
                  errors.password ? 'login-password-error' : undefined
                }
                aria-invalid={!!errors.password}
              />
            </FormField>

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

/* ─── Sub-components ─────────────────────────────────────────── */

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
