import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, UseFormRegister, FieldError } from 'react-hook-form';
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
import {
  MdEmail,
  MdLock,
  MdPerson,
  MdLocalHospital,
  MdPhone,
  MdLocationOn,
  MdBloodtype,
  MdCake,
  MdBadge,
  MdDomain,
} from 'react-icons/md';
import { IconType } from 'react-icons';
import { useRegisterDoador } from '@/service/donor/register';
import { useRegisterHospital } from '@/service/hospital/hospital';
import { TipoSanguineo } from '@/types/donar';
import axios from 'axios';
import { RegisterFormValues, registerSchema } from '@/schemas/donor';
import {
  HospitalRegisterFormValues,
  hospitalRegisterSchema,
} from '@/schemas/hospital';
import { BLOOD_TYPES, MUNICIPIOS_LUANDA } from '@/constants';

type Role = 'donor' | 'hospital';

export const Register: React.FC = () => {
  const navigate = useNavigate();

  const [activeRole, setActiveRole] = useState<Role>('donor');
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync: registerDoador } = useRegisterDoador();
  const { mutateAsync: registerHospital } = useRegisterHospital();

  // ── Formulário do doador ──────────────────────────────────────────────────
  const {
    register: registerDonor,
    handleSubmit: handleSubmitDonor,
    setValue: setValueDonor,
    formState: { errors: errorsDonor, isSubmitting: isSubmittingDonor },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'donor',
      consentimento_sms: false,
    },
  });

  // ── Formulário do hospital ────────────────────────────────────────────────
  const {
    register: registerHosp,
    handleSubmit: handleSubmitHosp,
    setValue: setValueHosp,
    formState: { errors: errorsHosp, isSubmitting: isSubmittingHosp },
  } = useForm<HospitalRegisterFormValues>({
    resolver: zodResolver(hospitalRegisterSchema),
    defaultValues: {
      role: 'hospital',
    },
  });

  // ── Troca de role ─────────────────────────────────────────────────────────
  const handleRoleChange = (role: Role) => {
    setActiveRole(role);
    if (role === 'donor') setValueDonor('role', 'donor');
    else setValueHosp('role', 'hospital');
    setServerError(null);
  };

  // ── Submit doador ─────────────────────────────────────────────────────────
  const onSubmitDonor = async (data: RegisterFormValues): Promise<void> => {
    setServerError(null);
    try {
      await registerDoador({
        nome_completo: data.nome_completo,
        telefone: data.telefone,
        email: data.email || null,
        senha: data.senha,
        tipo_sanguineo: data.tipo_sanguineo as TipoSanguineo,
        id_municipio: Number(data.id_municipio),
        data_nascimento: data.data_nascimento || null,
        consentimento_sms: data.consentimento_sms ?? false,
      });
      navigate('/login');
    } catch (err) {
      setServerError(resolveAxiosError(err));
    }
  };

  // ── Submit hospital ───────────────────────────────────────────────────────
  const onSubmitHospital = async (
    data: HospitalRegisterFormValues
  ): Promise<void> => {
    setServerError(null);
    try {
      await registerHospital({
        nome: data.nome,
        nif: data.nif,
        id_provincia: 1, // única província disponível
        id_municipio: Number(data.id_municipio),
        endereco: data.endereco,
        telefone: data.telefone,
        email: data.email,
        senha: data.senha,
      });

      navigate('/');
    } catch (err) {
      setServerError(resolveAxiosError(err));
    }
  };

  const isSubmitting = isSubmittingDonor || isSubmittingHosp;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 py-10 sm:py-14 transition-colors duration-500">
      {/* Blobs decorativos */}
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
          {/* Selector de role */}
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

          {/* Erro do servidor — partilhado entre os dois formulários */}
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

          {/* ── FORMULÁRIO DOADOR ── */}
          {activeRole === 'donor' && (
            <form
              onSubmit={handleSubmitDonor(onSubmitDonor)}
              className="space-y-4"
              noValidate
            >
              <input type="hidden" {...registerDonor('role')} value="donor" />

              <FormInput
                id="donor-name"
                label="Nome completo"
                name="nome_completo"
                type="text"
                autoComplete="name"
                register={registerDonor}
                error={errorsDonor.nome_completo}
                Icon={MdPerson}
              />
              <FormInput
                id="donor-email"
                label="Endereço de e-mail"
                name="email"
                type="email"
                autoComplete="email"
                register={registerDonor}
                error={errorsDonor.email}
                Icon={MdEmail}
              />
              <FormInput
                id="donor-password"
                label="Senha"
                name="senha"
                type="password"
                autoComplete="new-password"
                register={registerDonor}
                error={errorsDonor.senha}
                Icon={MdLock}
              />
              <FormInput
                id="donor-phone"
                label="Telefone"
                name="telefone"
                type="tel"
                autoComplete="tel"
                register={registerDonor}
                error={errorsDonor.telefone}
                Icon={MdPhone}
              />
              <MunicipioSelect
                register={registerDonor}
                error={errorsDonor.id_municipio}
              />
              <BloodTypeSelect register={registerDonor} />
              <FormInput
                id="donor-birthdate"
                label="Data de nascimento"
                name="data_nascimento"
                type="date"
                autoComplete="bday"
                register={registerDonor}
                error={errorsDonor.data_nascimento}
                Icon={MdCake}
              />
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  {...registerDonor('consentimento_sms')}
                  type="checkbox"
                  className="size-4 rounded accent-primary cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                  Aceito receber notificações por SMS sobre campanhas de doação
                </span>
              </label>

              <SubmitButton
                isSubmitting={isSubmittingDonor}
                colorClass=""
                label="Continuar cadastro"
              />
            </form>
          )}

          {/* ── FORMULÁRIO HOSPITAL ── */}
          {activeRole === 'hospital' && (
            <form
              onSubmit={handleSubmitHosp(onSubmitHospital)}
              className="space-y-4"
              noValidate
            >
              <input type="hidden" {...registerHosp('role')} value="hospital" />

              {/* Nome do hospital */}
              <HospFormInput
                id="hosp-name"
                label="Nome do hospital"
                name="nome"
                type="text"
                autoComplete="organization"
                register={registerHosp}
                error={errorsHosp.nome}
                Icon={MdDomain}
              />

              {/* NIF */}
              <HospFormInput
                id="hosp-nif"
                label="NIF"
                name="nif"
                type="text"
                autoComplete="off"
                register={registerHosp}
                error={errorsHosp.nif}
                Icon={MdBadge}
              />

              {/* Email */}
              <HospFormInput
                id="hosp-email"
                label="Endereço de e-mail"
                name="email"
                type="email"
                autoComplete="email"
                register={registerHosp}
                error={errorsHosp.email}
                Icon={MdEmail}
              />

              {/* Senha */}
              <HospFormInput
                id="hosp-password"
                label="Senha"
                name="senha"
                type="password"
                autoComplete="new-password"
                register={registerHosp}
                error={errorsHosp.senha}
                Icon={MdLock}
              />

              {/* Telefone */}
              <HospFormInput
                id="hosp-phone"
                label="Telefone"
                name="telefone"
                type="tel"
                autoComplete="tel"
                register={registerHosp}
                error={errorsHosp.telefone}
                Icon={MdPhone}
              />

              {/* Município */}
              <HospMunicipioSelect
                register={registerHosp}
                error={errorsHosp.id_municipio}
              />

              {/* Endereço */}
              <HospFormInput
                id="hosp-address"
                label="Endereço"
                name="endereco"
                type="text"
                autoComplete="street-address"
                register={registerHosp}
                error={errorsHosp.endereco}
                Icon={MdLocationOn}
              />

              <SubmitButton
                isSubmitting={isSubmittingHosp}
                colorClass="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                label="Registar hospital"
              />
            </form>
          )}

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

/* ─── Utilitário de erros Axios ──────────────────────────────────────────── */

function resolveAxiosError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    if (status === 409) return 'Este email, NIF ou telefone já está registado.';
    if (status === 400)
      return 'Dados inválidos. Verifique os campos e tente novamente.';
    if (!err.response)
      return 'Sem ligação ao servidor. Verifique a sua internet.';
    return 'Ocorreu um erro. Tente novamente.';
  }
  return 'Erro inesperado. Tente novamente.';
}

/* ─── Sub-componentes partilhados ────────────────────────────────────────── */

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

/* ─── FormInput genérico — tipado para doador ────────────────────────────── */

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

/* ─── FormInput genérico — tipado para hospital ──────────────────────────── */

interface HospFormInputProps {
  id: string;
  label: string;
  name: keyof HospitalRegisterFormValues;
  type?: React.HTMLInputTypeAttribute;
  autoComplete?: string;
  register: UseFormRegister<HospitalRegisterFormValues>;
  error?: FieldError;
  Icon: IconType;
}

const HospFormInput: React.FC<HospFormInputProps> = ({
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
            : 'text-slate-400 group-focus-within:text-blue-500'
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
            : 'border-transparent focus:border-blue-400/40 focus:bg-white dark:focus:bg-slate-900'
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

/* ─── Select de Município — doador ───────────────────────────────────────── */

interface MunicipioSelectProps {
  register: UseFormRegister<RegisterFormValues>;
  error?: FieldError;
}

const MunicipioSelect: React.FC<MunicipioSelectProps> = ({
  register,
  error,
}) => (
  <div className="space-y-1.5">
    <label
      htmlFor="donor-municipio"
      className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1 block"
    >
      Município
    </label>
    <div className="relative">
      <MdLocationOn
        className={cn(
          'absolute left-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none transition-colors',
          error ? 'text-red-500' : 'text-slate-400'
        )}
        aria-hidden
      />
      <select
        {...register('id_municipio')}
        id="donor-municipio"
        className={cn(
          'w-full bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl py-3.5 sm:py-4 pl-12 pr-10 outline-none appearance-none font-bold text-slate-900 dark:text-white text-sm sm:text-base transition-all cursor-pointer',
          error
            ? 'border-red-200 dark:border-red-900/50 focus:border-red-500'
            : 'border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-900'
        )}
      >
        <option value="">Seleccione o município</option>
        {MUNICIPIOS_LUANDA.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nome}
          </option>
        ))}
      </select>
      <ChevronIcon />
    </div>
    {error?.message && (
      <p
        role="alert"
        className="text-red-500 text-[10px] font-black uppercase tracking-wide ml-1"
      >
        {error.message}
      </p>
    )}
  </div>
);

/* ─── Select de Município — hospital ─────────────────────────────────────── */

interface HospMunicipioSelectProps {
  register: UseFormRegister<HospitalRegisterFormValues>;
  error?: FieldError;
}

const HospMunicipioSelect: React.FC<HospMunicipioSelectProps> = ({
  register,
  error,
}) => (
  <div className="space-y-1.5">
    <label
      htmlFor="hosp-municipio"
      className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1 block"
    >
      Município
    </label>
    <div className="relative">
      <MdLocationOn
        className={cn(
          'absolute left-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none transition-colors',
          error ? 'text-red-500' : 'text-slate-400'
        )}
        aria-hidden
      />
      <select
        {...register('id_municipio')}
        id="hosp-municipio"
        className={cn(
          'w-full bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl py-3.5 sm:py-4 pl-12 pr-10 outline-none appearance-none font-bold text-slate-900 dark:text-white text-sm sm:text-base transition-all cursor-pointer',
          error
            ? 'border-red-200 dark:border-red-900/50 focus:border-red-500'
            : 'border-transparent focus:border-blue-400/40 focus:bg-white dark:focus:bg-slate-900'
        )}
        defaultValue=""
      >
        <option value="" disabled>
          Seleccione o município
        </option>
        {MUNICIPIOS_LUANDA.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nome}
          </option>
        ))}
      </select>
      <ChevronIcon />
    </div>
    {error?.message && (
      <p
        role="alert"
        className="text-red-500 text-[10px] font-black uppercase tracking-wide ml-1"
      >
        {error.message}
      </p>
    )}
  </div>
);

/* ─── Blood type select ──────────────────────────────────────────────────── */

interface BloodTypeSelectProps {
  register: UseFormRegister<RegisterFormValues>;
}

const BloodTypeSelect: React.FC<BloodTypeSelectProps> = ({ register }) => (
  <div className="space-y-1.5">
    <label
      htmlFor="donor-bloodtype"
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
        {...register('tipo_sanguineo')}
        id="donor-bloodtype"
        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-900 rounded-2xl py-3.5 sm:py-4 pl-12 pr-10 outline-none appearance-none font-bold text-slate-900 dark:text-white text-sm sm:text-base transition-all cursor-pointer"
      >
        {BLOOD_TYPES.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <ChevronIcon />
    </div>
  </div>
);

/* ─── Botão de submit ────────────────────────────────────────────────────── */

interface SubmitButtonProps {
  isSubmitting: boolean;
  colorClass: string;
  label: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  colorClass,
  label,
}) => (
  <Button
    type="submit"
    className={cn(
      'w-full py-6 sm:py-7 text-base sm:text-lg rounded-2xl mt-2 font-bold transition-all duration-200',
      colorClass || 'shadow-lg shadow-primary/20'
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
      label
    )}
  </Button>
);

/* ─── Chevron SVG reutilizável ───────────────────────────────────────────── */

const ChevronIcon: React.FC = () => (
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
);

/* ─── Spinner ────────────────────────────────────────────────────────────── */

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
