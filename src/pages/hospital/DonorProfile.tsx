import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  MdBusiness,
  MdLocationOn,
  MdLock,
  MdEmail,
  MdPhone,
  MdBadge,
  MdAccountBalance,
  MdVerified,
  MdWarning,
  MdCheckCircle,
} from 'react-icons/md';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/Badge';
import { useHospitalAuthStore } from '@/hooks/hospitalAuth';
import {
  useHospitalProfile,
  useChangeHospitalPassword,
} from '@/service/hospital/hospital';
import { MUNICIPIOS_LUANDA } from '@/constants';
import { cn } from '@/lib/utils';
import axios from 'axios';

// ── Schema de alteração de senha ──────────────────────────────────────────────

const changePasswordSchema = z
  .object({
    currentSenha: z
      .string()
      .min(5, 'A senha deve ter pelo menos 5 caracteres.'),
    newSenha: z
      .string()
      .min(5, 'A nova senha deve ter pelo menos 5 caracteres.'),
    confirmSenha: z.string().min(5, 'Confirme a nova senha.'),
  })
  .refine((d) => d.newSenha === d.confirmSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmSenha'],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

// ── Componente principal ──────────────────────────────────────────────────────

export const HospitalProfile = () => {
  const user = useHospitalAuthStore((s) => s.user);
  const [passwordFeedback, setPasswordFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Busca perfil actualizado a partir do backend
  const { data: profile, isLoading } = useHospitalProfile(user?.id_hospital);

  // Usa dados do backend se disponíveis, senão usa o store (cache local)
  const hospital = profile ?? user;

  const municipio =
    MUNICIPIOS_LUANDA.find((m) => m.id === hospital?.id_municipio)?.nome ?? '—';

  const { mutateAsync: changePassword } = useChangeHospitalPassword(
    user?.id_hospital
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onChangePassword = async (data: ChangePasswordForm) => {
    setPasswordFeedback(null);
    try {
      await changePassword({
        currentSenha: data.currentSenha,
        newSenha: data.newSenha,
      });
      setPasswordFeedback({
        type: 'success',
        message: 'Palavra-passe actualizada com sucesso.',
      });
      reset();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401) {
          setPasswordFeedback({
            type: 'error',
            message: 'A senha actual está incorrecta.',
          });
        } else if (status === 400) {
          setPasswordFeedback({
            type: 'error',
            message: 'Dados inválidos. Verifique os campos.',
          });
        } else {
          setPasswordFeedback({
            type: 'error',
            message: 'Ocorreu um erro. Tente novamente.',
          });
        }
      } else {
        setPasswordFeedback({
          type: 'error',
          message: 'Erro inesperado. Tente novamente.',
        });
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Perfil da Instituição
        </h1>
        <p className="text-slate-500 text-sm md:text-base">
          Informações oficiais do hospital perante o Sistema Nacional de Saúde.
        </p>
      </header>

      {/* ── Card de resumo do hospital ── */}
      <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
        <CardContent className="pt-6">
          {isLoading ? (
            <ProfileSkeleton />
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Avatar / Inicial */}
              <div className="size-16 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
                <span className="text-white text-2xl font-black">
                  {hospital?.nome?.charAt(0) ?? 'H'}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate">
                    {hospital?.nome ?? '—'}
                  </h2>
                  <Badge
                    className={cn(
                      'text-xs font-bold rounded-full px-3',
                      hospital?.status === 'ativo'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    )}
                  >
                    {hospital?.status === 'ativo' ? (
                      <span className="flex items-center gap-1">
                        <MdVerified className="text-sm" /> Activo
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <MdWarning className="text-sm" /> Inactivo
                      </span>
                    )}
                  </Badge>
                </div>

                {/* Info rápida em linha */}
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <MdEmail className="text-base shrink-0" />
                    {hospital?.email ?? '—'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MdPhone className="text-base shrink-0" />
                    {hospital?.telefone ?? '—'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MdLocationOn className="text-base shrink-0" />
                    {municipio}
                  </span>
                  <span className="flex items-center gap-1">
                    <MdBadge className="text-base shrink-0" />
                    NIF: {hospital?.nif ?? '—'}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  Membro desde{' '}
                  {hospital?.data_cadastro
                    ? new Date(hospital.data_cadastro).toLocaleDateString(
                        'pt-AO',
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      )
                    : '—'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto">
          <TabsTrigger value="general" className="rounded-lg px-6">
            Dados Gerais
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg px-6">
            Segurança
          </TabsTrigger>
        </TabsList>

        {/* ── DADOS GERAIS (só leitura) ── */}
        <TabsContent value="general">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isLoading ? (
              <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
                <CardContent className="pt-6">
                  <ProfileSkeleton rows={4} />
                </CardContent>
              </Card>
            ) : (
              <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Informações Oficiais
                  </CardTitle>
                  <CardDescription>
                    Dados registados no sistema. Para alterações contacte o
                    administrador.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InfoField
                      icon={<MdBusiness />}
                      label="Nome da Instituição"
                      value={hospital?.nome}
                    />
                    <InfoField
                      icon={<MdBadge />}
                      label="NIF (Contribuinte)"
                      value={hospital?.nif}
                    />
                    <InfoField
                      icon={<MdAccountBalance />}
                      label="Província"
                      value="Luanda"
                    />
                    <InfoField
                      icon={<MdLocationOn />}
                      label="Município"
                      value={municipio}
                    />
                    <InfoField
                      icon={<MdEmail />}
                      label="Email Institucional"
                      value={hospital?.email}
                    />
                    <InfoField
                      icon={<MdPhone />}
                      label="Contacto Telefónico"
                      value={hospital?.telefone}
                    />
                    <InfoField
                      icon={<MdLocationOn />}
                      label="Endereço"
                      value={hospital?.endereco}
                      className="sm:col-span-2"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </TabsContent>

        {/* ── SEGURANÇA / SENHA ── */}
        <TabsContent value="security">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="max-w-2xl border-slate-200 dark:border-slate-700 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Alterar Palavra-passe</CardTitle>
                <CardDescription>
                  Certifique-se de usar uma senha forte para proteger os dados
                  dos pacientes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit(onChangePassword)}
                  className="space-y-4"
                  noValidate
                >
                  {/* Feedback */}
                  {passwordFeedback && (
                    <div
                      role="alert"
                      className={cn(
                        'flex items-center gap-2 p-3 rounded-xl text-sm font-semibold border',
                        passwordFeedback.type === 'success'
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                      )}
                    >
                      {passwordFeedback.type === 'success' ? (
                        <MdCheckCircle className="text-lg shrink-0" />
                      ) : (
                        <MdWarning className="text-lg shrink-0" />
                      )}
                      {passwordFeedback.message}
                    </div>
                  )}

                  {/* Senha actual */}
                  <div className="space-y-1.5">
                    <Label htmlFor="currentSenha">Palavra-passe Actual</Label>
                    <Input
                      {...register('currentSenha')}
                      id="currentSenha"
                      type="password"
                      placeholder="••••••••"
                      className={cn(
                        'rounded-lg',
                        errors.currentSenha &&
                          'border-red-400 focus:border-red-500'
                      )}
                      aria-invalid={!!errors.currentSenha}
                    />
                    {errors.currentSenha && (
                      <p className="text-red-500 text-xs font-semibold">
                        {errors.currentSenha.message}
                      </p>
                    )}
                  </div>

                  {/* Nova senha + confirmação */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="newSenha">Nova Palavra-passe</Label>
                      <Input
                        {...register('newSenha')}
                        id="newSenha"
                        type="password"
                        placeholder="Mínimo 5 caracteres"
                        className={cn(
                          'rounded-lg',
                          errors.newSenha &&
                            'border-red-400 focus:border-red-500'
                        )}
                        aria-invalid={!!errors.newSenha}
                      />
                      {errors.newSenha && (
                        <p className="text-red-500 text-xs font-semibold">
                          {errors.newSenha.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="confirmSenha">
                        Confirmar Nova Palavra-passe
                      </Label>
                      <Input
                        {...register('confirmSenha')}
                        id="confirmSenha"
                        type="password"
                        placeholder="Repita a senha"
                        className={cn(
                          'rounded-lg',
                          errors.confirmSenha &&
                            'border-red-400 focus:border-red-500'
                        )}
                        aria-invalid={!!errors.confirmSenha}
                      />
                      {errors.confirmSenha && (
                        <p className="text-red-500 text-xs font-semibold">
                          {errors.confirmSenha.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white rounded-lg min-w-[180px]"
                      disabled={isSubmitting}
                      aria-busy={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <LoadingSpinner /> A actualizar...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <MdLock /> Actualizar Credenciais
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

/* ─── Sub-componentes ────────────────────────────────────────────────────── */

interface InfoFieldProps {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  className?: string;
}

const InfoField = ({ icon, label, value, className }: InfoFieldProps) => (
  <div className={cn('space-y-1', className)}>
    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
      {icon} {label}
    </p>
    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 rounded-lg px-3 py-2.5 border border-slate-100 dark:border-slate-700">
      {value ?? '—'}
    </p>
  </div>
);

interface ProfileSkeletonProps {
  rows?: number;
}

const ProfileSkeleton = ({ rows = 1 }: ProfileSkeletonProps) => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg" />
    ))}
  </div>
);

const LoadingSpinner = () => (
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
