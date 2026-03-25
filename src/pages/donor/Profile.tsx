import * as React from 'react';
import { useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Donor } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdBloodtype,
  MdCameraAlt,
  MdLock,
  MdCheckCircle,
  MdEdit,
  MdClose,
  MdVisibility,
  MdVisibilityOff,
} from 'react-icons/md';
import { cn } from '@/lib/utils';

interface FormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bloodType: string;
}

interface PasswordData {
  current: string;
  next: string;
  confirm: string;
}

type ToastType = 'success' | 'error';
interface Toast {
  message: string;
  type: ToastType;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const;

export const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const donor = user as Donor | null;

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPwd, setIsUpdatingPwd] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [showPwd, setShowPwd] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const [formData, setFormData] = useState<FormData>({
    name: donor?.name ?? 'Usuário',
    email: donor?.email ?? 'usuario@example.com',
    phone: donor?.phone ?? '9XX XXX XXX',
    location: 'Luanda, Angola',
    bloodType: donor?.bloodType ?? 'O+',
  });
  const [originalData] = useState<FormData>({ ...formData });

  const [pwdData, setPwdData] = useState<PasswordData>({
    current: '',
    next: '',
    confirm: '',
  });
  const [pwdError, setPwdError] = useState<string | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3500);
    },
    []
  );

  const handleSave = useCallback(() => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      showToast('Perfil atualizado com sucesso!');
    }, 1400);
  }, [showToast]);

  const handleCancel = useCallback(() => {
    setFormData({ ...originalData });
    setIsEditing(false);
  }, [originalData]);

  const handlePasswordUpdate = useCallback(() => {
    setPwdError(null);
    if (!pwdData.current) {
      setPwdError('Insira a senha atual.');
      return;
    }
    if (pwdData.next.length < 6) {
      setPwdError('Nova senha deve ter mínimo 6 caracteres.');
      return;
    }
    if (pwdData.next !== pwdData.confirm) {
      setPwdError('As senhas não coincidem.');
      return;
    }
    setIsUpdatingPwd(true);
    setTimeout(() => {
      setIsUpdatingPwd(false);
      setPwdData({ current: '', next: '', confirm: '' });
      showToast('Senha atualizada com sucesso!');
    }, 1400);
  }, [pwdData, showToast]);

  const field = (key: keyof FormData) => ({
    value: formData[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFormData((p) => ({ ...p, [key]: e.target.value })),
  });

  return (
    <div className="space-y-5 max-w-6xl mx-auto px-0 sm:px-2 animate-fadeUp">
      {/* Toast */}
      {toast && (
        <div
          className={cn(
            'fixed top-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold animate-slideDown max-w-xs',
            toast.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-red-600 text-white'
          )}
        >
          <MdCheckCircle className="text-lg shrink-0" />
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-white/70 hover:text-white"
          >
            <MdClose className="text-sm" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Meu Perfil
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-widest mt-1">
            Gerencie as suas informações e segurança
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="h-9 px-4 rounded-xl font-semibold text-sm border-slate-200 dark:border-slate-700 gap-1.5"
              >
                <MdClose className="text-sm" /> Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="h-9 px-4 rounded-xl font-bold text-sm shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all gap-1.5"
              >
                {isSaving ? (
                  <>
                    <SaveDots /> A guardar...
                  </>
                ) : (
                  <>
                    <MdCheckCircle className="text-sm" /> Guardar
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="h-9 px-4 rounded-xl font-bold text-sm shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all gap-1.5"
            >
              <MdEdit className="text-sm" /> Editar Perfil
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column */}
        <div className="space-y-4">
          {/* Avatar card */}
          <Card className="border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className="relative group cursor-pointer mb-4">
                <div className="size-20 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-black text-3xl border-2 border-white dark:border-slate-800 shadow-md overflow-hidden">
                  {donor?.name?.charAt(0) ?? 'U'}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                  <MdCameraAlt className="text-2xl text-white" />
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 size-7 bg-emerald-500 rounded-lg border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-md">
                  <MdCheckCircle className="text-white text-sm" />
                </div>
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {formData.name}
              </h2>
              <p className="text-slate-400 font-semibold text-[10px] uppercase tracking-widest mb-4">
                Doador Ativo
              </p>
              <div className="grid grid-cols-2 gap-3 w-full">
                <StatBox
                  label="Tipo Sanguíneo"
                  value={formData.bloodType}
                  accent="text-primary"
                />
                <StatBox label="Donativos" value="12" />
              </div>
            </CardContent>
          </Card>

          {/* Hero card */}
          <Card className="border-0 rounded-2xl bg-primary text-white overflow-hidden relative shadow-md shadow-primary/20">
            <div className="absolute -top-2 -right-2 opacity-[0.08]">
              <MdBloodtype className="text-[8rem]" />
            </div>
            <CardContent className="p-5 relative z-10">
              <h3 className="text-base font-black uppercase tracking-wide mb-1.5">
                Herói Local
              </h3>
              <p className="text-white/75 font-medium text-xs leading-relaxed mb-4">
                Já ajudou a salvar aproximadamente{' '}
                <strong className="text-white">36 vidas</strong> com os seus
                donativos regulares.
              </p>
              <Button
                variant="outline"
                className="w-full h-9 rounded-xl bg-white/15 border-white/25 text-white hover:bg-white hover:text-primary transition-all font-bold text-xs"
              >
                Ver Certificados
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Personal info */}
          <Card className="border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
            <CardHeader className="p-5 pb-0">
              <CardTitle className="text-base font-black flex items-center gap-2 text-slate-900 dark:text-white">
                <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MdPerson className="text-primary text-sm" />
                </div>
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ProfileField
                  label="Nome Completo"
                  icon={<MdPerson />}
                  disabled={!isEditing}
                  {...field('name')}
                />
                <ProfileField
                  label="E-mail"
                  icon={<MdEmail />}
                  type="email"
                  disabled={!isEditing}
                  {...field('email')}
                />
                <ProfileField
                  label="Telefone"
                  icon={<MdPhone />}
                  type="tel"
                  disabled={!isEditing}
                  {...field('phone')}
                />
                <ProfileField
                  label="Localização"
                  icon={<MdLocationOn />}
                  disabled={!isEditing}
                  {...field('location')}
                />
              </div>

              {/* Blood type - only when editing */}
              {isEditing && (
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1 block">
                    Tipo Sanguíneo
                  </Label>
                  <div className="relative">
                    <MdBloodtype className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-slate-400 pointer-events-none" />
                    <select
                      {...field('bloodType')}
                      className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 rounded-xl pl-10 pr-4 text-sm font-bold text-slate-900 dark:text-white outline-none appearance-none transition-all cursor-pointer"
                    >
                      {BLOOD_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="flex justify-end pt-1">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-10 px-6 rounded-xl font-bold text-sm shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all gap-1.5"
                  >
                    {isSaving ? (
                      <>
                        <SaveDots /> A guardar...
                      </>
                    ) : (
                      'Guardar Alterações'
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
            <CardHeader className="p-5 pb-0">
              <CardTitle className="text-base font-black flex items-center gap-2 text-slate-900 dark:text-white">
                <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MdLock className="text-primary text-sm" />
                </div>
                Segurança da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <PasswordField
                label="Senha Atual"
                value={pwdData.current}
                show={showPwd.current}
                onToggle={() =>
                  setShowPwd((p) => ({ ...p, current: !p.current }))
                }
                onChange={(v) => setPwdData((p) => ({ ...p, current: v }))}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PasswordField
                  label="Nova Senha"
                  value={pwdData.next}
                  show={showPwd.next}
                  onToggle={() => setShowPwd((p) => ({ ...p, next: !p.next }))}
                  onChange={(v) => setPwdData((p) => ({ ...p, next: v }))}
                />
                <PasswordField
                  label="Confirmar Nova Senha"
                  value={pwdData.confirm}
                  show={showPwd.confirm}
                  onToggle={() =>
                    setShowPwd((p) => ({ ...p, confirm: !p.confirm }))
                  }
                  onChange={(v) => setPwdData((p) => ({ ...p, confirm: v }))}
                />
              </div>

              {/* Password strength */}
              {pwdData.next && <PasswordStrength password={pwdData.next} />}

              {pwdError && (
                <p className="text-red-500 text-xs font-semibold flex items-center gap-1.5">
                  <MdClose className="text-sm shrink-0" /> {pwdError}
                </p>
              )}

              <Button
                variant="outline"
                onClick={handlePasswordUpdate}
                disabled={isUpdatingPwd}
                className="h-10 px-5 rounded-xl font-bold text-sm border-primary/20 text-primary hover:bg-primary/5 hover:-translate-y-0.5 transition-all gap-1.5"
              >
                {isUpdatingPwd ? (
                  <>
                    <SaveDots /> A atualizar...
                  </>
                ) : (
                  <>
                    <MdLock className="text-sm" /> Atualizar Senha
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .animate-fadeUp { animation: fadeUp 0.45s ease both; }
        .animate-slideDown { animation: slideDown 0.3s ease both; }
      `}</style>
    </div>
  );
};

/* ─── Sub-components ─────────────────────────────────────────── */

const StatBox: React.FC<{ label: string; value: string; accent?: string }> = ({
  label,
  value,
  accent,
}) => (
  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
      {label}
    </p>
    <p
      className={cn(
        'text-lg font-black',
        accent ?? 'text-slate-900 dark:text-white'
      )}
    >
      {value}
    </p>
  </div>
);

interface ProfileFieldProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  type?: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  icon,
  value,
  onChange,
  disabled = false,
  type = 'text',
}) => (
  <div className="space-y-1.5">
    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1 block">
      {label}
    </Label>
    <div className="relative">
      <span
        className={cn(
          'absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none transition-colors',
          disabled ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400'
        )}
      >
        {icon}
      </span>
      <Input
        disabled={disabled}
        value={value}
        onChange={onChange}
        type={type}
        className={cn(
          'pl-10 h-11 rounded-xl text-sm font-medium border transition-all',
          disabled
            ? 'bg-slate-50 dark:bg-slate-800/40 border-transparent text-slate-500 dark:text-slate-400 cursor-default'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 text-slate-900 dark:text-white'
        )}
      />
    </div>
  </div>
);

interface PasswordFieldProps {
  label: string;
  value: string;
  show: boolean;
  onToggle: () => void;
  onChange: (v: string) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  value,
  show,
  onToggle,
  onChange,
}) => (
  <div className="space-y-1.5">
    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1 block">
      {label}
    </Label>
    <div className="relative">
      <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-slate-400 pointer-events-none" />
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 rounded-xl pl-10 pr-10 text-sm font-medium text-slate-900 dark:text-white outline-none transition-all"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
      >
        {show ? (
          <MdVisibilityOff className="text-base" />
        ) : (
          <MdVisibility className="text-base" />
        )}
      </button>
    </div>
  </div>
);

const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
  const score = [/.{6,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) =>
    r.test(password)
  ).length;
  const levels = [
    { label: 'Fraca', color: 'bg-red-500' },
    { label: 'Razoável', color: 'bg-amber-400' },
    { label: 'Boa', color: 'bg-blue-500' },
    { label: 'Forte', color: 'bg-emerald-500' },
  ];
  const level = levels[score - 1] ?? levels[0];
  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'flex-1 h-1 rounded-full transition-all duration-300',
              i <= score ? level.color : 'bg-slate-100 dark:bg-slate-800'
            )}
          />
        ))}
      </div>
      <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
        Força:{' '}
        <span className="font-bold text-slate-700 dark:text-slate-300">
          {level.label}
        </span>
      </p>
    </div>
  );
};

const SaveDots: React.FC = () => (
  <span className="flex items-center gap-0.5 mr-0.5">
    {[0, 150, 300].map((d) => (
      <span
        key={d}
        className="w-1 h-1 rounded-full bg-current animate-bounce"
        style={{ animationDelay: `${d}ms` }}
      />
    ))}
  </span>
);
