import * as React from 'react';
import { useState } from 'react';
import { useAuthStore } from '@/hooks/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, ProfileFormValues } from '@/schemas/donor/index';
import { updateDonorProfile } from '@/service/donor/profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MdBloodtype, MdEdit, MdCheckCircle, MdClose } from 'react-icons/md';
import { cn } from '@/lib/utils';
import { BLOOD_TYPES, TIPO_LABEL } from '@/constants/index';
import { useGamificationStatus } from '@/service/donor/gami';

export const Profile: React.FC = () => {
  const { session, updateUser } = useAuthStore();
  const user = session?.user;

  // Não renderiza enquanto user não estiver disponível
  if (!user) return null;

  return <ProfileContent />;
};

const ProfileContent: React.FC = () => {
  const { session, updateUser } = useAuthStore();
  const user = session?.user;

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const { data: stats } = useGamificationStatus(user.id_doador);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nome_completo: user.nome_completo ?? '',
      email: user.email ?? '',
      telefone: user.telefone ?? '',
      tipo_sanguineo: user.tipo_sanguineo ?? '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSaving(true);
      await updateDonorProfile(user.id_doador, data);
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

  // Garantir que não tentamos renderizar sem um user definido
  if (!user) return null;

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

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT */}
        <Card>
          <CardContent className="p-5 text-center">
            <h2 className="text-lg font-black">{user.nome_completo}</h2>
            <p className="text-xs uppercase text-slate-400">Doador ativo</p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="p-2 bg-slate-100 rounded text-center">
                <p className="text-xs">Tipo</p>
                <p className="font-black">
                  {TIPO_LABEL[user.tipo_sanguineo ?? ''] ??
                    user.tipo_sanguineo ??
                    '-'}
                </p>
              </div>
              <div className="p-2 bg-slate-100 rounded text-center">
                <p className="text-xs">Status</p>
                <p className="font-black">Ativo</p>
              </div>
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
                  {String(stats?.vidas_salvas ?? 0)} vidas
                </strong>{' '}
                com os seus donativos regulares.
              </p>
              <div className="w-full h-9 rounded-xl bg-white/15 border-white/25 text-white font-bold text-xs p-2">
                <span>
                  Quantidade de doações: {String(stats?.total_doacoes ?? 0)}
                </span>
              </div>
            </CardContent>
          </Card>
        </Card>

        {/* RIGHT — FORM */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Nome</label>
                <input
                  {...register('nome_completo')}
                  disabled={!isEditing}
                  className="w-full p-2 rounded border border-slate-300 disabled:bg-slate-50 disabled:text-slate-500"
                />
                {errors.nome_completo && (
                  <span className="text-xs text-red-500">
                    {errors.nome_completo.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Email</label>
                <input
                  {...register('email')}
                  disabled={!isEditing}
                  className="w-full p-2 rounded border border-slate-300 disabled:bg-slate-50 disabled:text-slate-500"
                />
                {errors.email && (
                  <span className="text-xs text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Telefone</label>
                <input
                  {...register('telefone')}
                  disabled={!isEditing}
                  className="w-full p-2 rounded border border-slate-300 disabled:bg-slate-50 disabled:text-slate-500"
                />
                {errors.telefone && (
                  <span className="text-xs text-red-500">
                    {errors.telefone.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Tipo sanguíneo</label>
                <select
                  {...register('tipo_sanguineo')}
                  disabled={!isEditing}
                  className="w-full p-2 rounded border border-slate-300 disabled:bg-slate-50 disabled:text-slate-500"
                >
                  {BLOOD_TYPES.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
                {errors.tipo_sanguineo && (
                  <span className="text-xs text-red-500">
                    {errors.tipo_sanguineo.message}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .animate-fadeUp { animation: fadeUp 0.45s ease both; }
      `}</style>
    </div>
  );
};
