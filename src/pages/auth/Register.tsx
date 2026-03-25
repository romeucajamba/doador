import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, UseFormRegister, FieldError } from 'react-hook-form';
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
import {
  MdEmail,
  MdLock,
  MdPerson,
  MdLocalHospital,
  MdPhone,
  MdLocationOn,
  MdBloodtype,
} from 'react-icons/md';
import { IconType } from 'react-icons';

const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Endereço de e-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['donor', 'hospital']),
  bloodType: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

type Role = 'donor' | 'hospital';

type NewUser = RegisterFormValues & { id: string };

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [activeRole, setActiveRole] = useState<Role>('donor');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'donor' },
  });

  const handleRoleChange = (role: Role) => {
    setActiveRole(role);
    setValue('role', role);
  };

  const onSubmit = async (data: RegisterFormValues): Promise<void> => {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        const newUser: NewUser = {
          id: Math.random().toString(36).substring(2, 11),
          ...data,
        };
        login(newUser);
        navigate(
          data.role === 'donor' ? '/donor/dashboard' : '/hospital/dashboard'
        );
        resolve();
      }, 1500);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 py-10 sm:py-14 transition-colors duration-500">
      {/* Background decorative blobs */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-40 -right-40 w-80 h-80 sm:w-[480px] sm:h-[480px] rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 sm:w-[480px] sm:h-[480px] rounded-full bg-rose-500/5 dark:bg-rose-500/10 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-sm sm:max-w-lg border-none shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
        <CardHeader className="text-center space-y-3 pb-4 px-5 sm:px-8 pt-8">
          <div className="mx-auto size-14 sm:size-16 bg-primary/10 dark:bg-primary/20 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-2">
            <span className="text-primary text-2xl sm:text-3xl font-black tracking-tighter">
              B+
            </span>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Junte-se à comunidade
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Comece a salvar vidas hoje criando uma conta.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 px-5 sm:px-8 pb-8">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <RoleButton
              active={activeRole === 'donor'}
              onClick={() => handleRoleChange('donor')}
              icon={<MdPerson className="text-lg sm:text-xl shrink-0" />}
              label="Sou Doador"
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

            <FormInput
              id="register-name"
              label="Nome completo / Entidade"
              name="name"
              type="text"
              autoComplete="name"
              register={register}
              error={errors.name}
              Icon={MdPerson}
            />

            <FormInput
              id="register-email"
              label="Endereço de e-mail"
              name="email"
              type="email"
              autoComplete="email"
              register={register}
              error={errors.email}
              Icon={MdEmail}
            />

            <FormInput
              id="register-password"
              label="Senha"
              name="password"
              type="password"
              autoComplete="new-password"
              register={register}
              error={errors.password}
              Icon={MdLock}
            />

            {activeRole === 'donor' ? (
              <BloodTypeSelect register={register} />
            ) : (
              <>
                <FormInput
                  id="register-phone"
                  label="Telefone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  register={register}
                  error={errors.phone}
                  Icon={MdPhone}
                />
                <FormInput
                  id="register-address"
                  label="Endereço"
                  name="address"
                  type="text"
                  autoComplete="street-address"
                  register={register}
                  error={errors.address}
                  Icon={MdLocationOn}
                />
              </>
            )}

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
                  Criando conta segura...
                </span>
              ) : (
                'Continuar cadastro'
              )}
            </Button>
          </form>

          <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium pt-1">
            Já tem uma conta?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-primary font-black hover:underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              Entrar
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

interface FormInputProps {
  id: string;
  label: string;
  name: keyof RegisterFormValues;
  type?: React.HTMLInputTypeAttribute;
  autoComplete?: string;
  register: UseFormRegister<RegisterFormValues>;
  error?: FieldError;
  Icon: IconType;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  name,
  type = 'text',
  autoComplete,
  register,
  error,
  Icon,
}) => (
  <div className="space-y-1.5">
    <label
      htmlFor={id}
      className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1 block"
    >
      {label}
    </label>
    <div className="relative group">
      <Icon
        className={cn(
          'absolute left-4 top-1/2 -translate-y-1/2 text-xl transition-colors pointer-events-none',
          error
            ? 'text-red-500'
            : 'text-slate-400 group-focus-within:text-primary'
        )}
        aria-hidden
      />
      <input
        {...register(name)}
        id={id}
        type={type}
        autoComplete={autoComplete}
        className={cn(
          'w-full bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl py-3.5 sm:py-4 pl-12 pr-4 outline-none transition-all font-medium text-slate-900 dark:text-white text-sm sm:text-base placeholder:text-slate-400',
          error
            ? 'border-red-200 dark:border-red-900/50 focus:border-red-500'
            : 'border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-900'
        )}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
      />
    </div>
    {error?.message && (
      <p
        id={`${id}-error`}
        role="alert"
        className="text-red-500 text-[10px] font-black uppercase tracking-wide ml-1"
      >
        {error.message}
      </p>
    )}
  </div>
);

interface BloodTypeSelectProps {
  register: UseFormRegister<RegisterFormValues>;
}

const BloodTypeSelect: React.FC<BloodTypeSelectProps> = ({ register }) => (
  <div className="space-y-1.5">
    <label
      htmlFor="register-bloodtype"
      className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1 block"
    >
      Tipo sanguíneo
    </label>
    <div className="relative">
      <MdBloodtype
        className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 pointer-events-none"
        aria-hidden
      />
      <select
        {...register('bloodType')}
        id="register-bloodtype"
        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-900 rounded-2xl py-3.5 sm:py-4 pl-12 pr-4 outline-none appearance-none font-bold text-slate-900 dark:text-white text-sm sm:text-base transition-all cursor-pointer"
      >
        {BLOOD_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      {/* Custom dropdown arrow */}
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
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
