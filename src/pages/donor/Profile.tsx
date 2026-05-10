import * as React from 'react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/hooks/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, ProfileFormValues } from '@/schemas/donor/index';
import { updateDonorProfile } from '@/service/donor/profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdBloodtype,
  MdEdit,
  MdCheckCircle,
  MdClose,
} from 'react-icons/md';
import { cn } from '@/lib/utils';
import { BLOOD_TYPES } from '@/constants/index';
import { useGamificationStatus } from '@/service/donor/gami';

export const Profile: React.FC = () => {
  const { session, updateUser } = useAuthStore();
  const user = session?.user;

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: stats, isLoading } = useGamificationStatus(user?.id_doador);

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const { register, handleSubmit, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  /* =========================
     LOAD USER
  ========================= */
  useEffect(() => {
    if (!user) return;

    reset({
      nome_completo: user.nome_completo,
      email: user.email,
      telefone: user.telefone,
      tipo_sanguineo: user.tipo_sanguineo,
    });
  }, [user, reset]);

  /* =========================
     SAVE PROFILE
  ========================= */
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user?.id_doador) return;

    try {
      setIsSaving(true);

      await updateDonorProfile(user.id_doador, data);

      // ⚡ atualiza Zustand (fonte única da verdade)
      updateUser({
        nome_completo: data.nome_completo,
        telefone: data.telefone,
        tipo_sanguineo: data.tipo_sanguineo,
      });

      setToast({ message: 'Perfil atualizado com sucesso!', type: 'success' });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Erro ao atualizar perfil', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto px-0 sm:px-2 animate-fadeUp">
      {/* TOAST */}
      {toast && (
        <div
          className={cn(
            'fixed top-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold',
            toast.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-red-600 text-white'
          )}
        >
          <MdCheckCircle />
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => setToast(null)}>
            <MdClose />
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Meu Perfil
          </h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest">
            Gerencie suas informações
          </p>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <MdEdit /> Editar
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>

              <Button onClick={handleSubmit(onSubmit)} disabled={isSaving}>
                {isSaving ? 'A guardar...' : 'Guardar'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* MAIN GRID (NÃO ALTEREI DESIGN) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT */}
        <Card>
          <CardContent className="p-5 text-center">
            <h2 className="text-lg font-black">{user?.nome_completo}</h2>

            <p className="text-xs uppercase text-slate-400">Doador ativo</p>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <StatBox label="Tipo" value={user?.tipo_sanguineo ?? '-'} />
              <StatBox label="Status" value="Ativo" />
            </div>
          </CardContent>

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
                <strong className="text-white">
                  {String(stats?.total_doacoes ?? 0)} vidas
                </strong>{' '}
                com os seus donativos regulares.
              </p>
              <Button
                variant="outline"
                className="w-full h-9 rounded-xl bg-white/15 border-white/25 text-white hover:bg-white hover:text-primary transition-all font-bold text-xs"
              >
                Quantidade de hospitais {String(stats?.total_centros ?? 0)}
              </Button>
            </CardContent>
          </Card>
        </Card>

        {/* RIGHT */}
        <div className="lg:col-span-2 space-y-4">
          {/* FORM */}
          <Card>
            <CardHeader>
              <CardTitle>Informações pessoais</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Field
                label="Nome"
                icon={<MdPerson />}
                disabled={!isEditing}
                {...register('nome_completo')}
              />

              <Field
                label="Email"
                icon={<MdEmail />}
                disabled
                {...register('email')}
              />

              <Field
                label="Telefone"
                icon={<MdPhone />}
                disabled={!isEditing}
                {...register('telefone')}
              />

              {/* BLOOD TYPE */}
              <div>
                <Label>Tipo sanguíneo</Label>
                <select
                  disabled={!isEditing}
                  {...register('tipo_sanguineo')}
                  className="w-full p-2 rounded border"
                >
                  {BLOOD_TYPES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
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

/* =========================
   SUB COMPONENTS (IGUAIS)
========================= */

const Field = ({ label, icon, ...props }: any) => (
  <div>
    <Label>{label}</Label>
    <div className="flex items-center gap-2">
      {icon}
      <Input {...props} />
    </div>
  </div>
);

const StatBox = ({ label, value }: any) => (
  <div className="p-2 bg-slate-100 rounded text-center">
    <p className="text-xs">{label}</p>
    <p className="font-black">{value}</p>
  </div>
);
