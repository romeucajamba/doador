import { useState } from 'react';
import { useHospitalAuthStore } from '@/hooks/hospitalAuth';
import {
  useUpdateHospital,
  useChangeHospitalPassword,
} from '@/service/hospital/hospital';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  MdLocalHospital,
  MdEmail,
  MdLock,
  MdSave,
  MdLocationOn,
  MdPhone,
} from 'react-icons/md';

export const HospitalProfile = () => {
  const { user, updateHospitalUser } = useHospitalAuthStore();
  const id_hospital = user?.id_hospital;

  const updateProfile = useUpdateHospital(id_hospital);
  const changePassword = useChangeHospitalPassword(id_hospital);

  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [endereco, setEndereco] = useState(user?.endereco || '');
  const [telefone, setTelefone] = useState(user?.telefone || '');

  const [currentSenha, setCurrentSenha] = useState('');
  const [newSenha, setNewSenha] = useState('');

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload: any = {
        nome,
        email,
        endereco,
        telefone,
      };

      const updatedData = await updateProfile.mutateAsync(payload);

      updateHospitalUser({
        nome: updatedData.nome,
        email: updatedData.email,
        endereco: updatedData.endereco,
        telefone: updatedData.telefone,
      });

      if (currentSenha && newSenha) {
        await changePassword.mutateAsync({ currentSenha, newSenha });
        setCurrentSenha('');
        setNewSenha('');
      }

      setSuccess('Perfil do hospital atualizado com sucesso!');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Erro ao atualizar perfil. Verifique os dados.'
      );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <MdLocalHospital className="text-primary" /> Perfil do Hospital
        </h1>
        <p className="text-slate-500 font-medium text-lg">
          Gerencie as informações do centro e as credenciais de acesso.
        </p>
      </div>

      <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl font-black text-primary flex items-center gap-2">
            <MdLocalHospital /> Dados da Instituição
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl border border-red-100 dark:border-red-900/50">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nome" className="flex items-center gap-2">
                  <MdLocalHospital className="text-slate-400" /> Nome da
                  Instituição
                </Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-slate-950"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <MdEmail className="text-slate-400" /> E-mail de Contacto
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-slate-950"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco" className="flex items-center gap-2">
                  <MdLocationOn className="text-slate-400" /> Endereço Completo
                </Label>
                <Input
                  id="endereco"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-slate-950"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone" className="flex items-center gap-2">
                  <MdPhone className="text-slate-400" /> Telefone
                </Label>
                <Input
                  id="telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-slate-950"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MdLock className="text-primary" /> Alterar Palavra-passe
                </h3>
                <p className="text-xs text-slate-500">
                  Preencha apenas se pretender alterar a senha de acesso.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentSenha">Palavra-passe Atual</Label>
                  <Input
                    id="currentSenha"
                    type="password"
                    value={currentSenha}
                    onChange={(e) => setCurrentSenha(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white dark:bg-slate-950"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newSenha">Nova Palavra-passe</Label>
                  <Input
                    id="newSenha"
                    type="password"
                    value={newSenha}
                    onChange={(e) => setNewSenha(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white dark:bg-slate-950"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button
                type="submit"
                disabled={updateProfile.isPending || changePassword.isPending}
                className="font-black px-8 bg-primary hover:bg-primary/90 text-white"
              >
                {updateProfile.isPending || changePassword.isPending ? (
                  'A GUARDAR...'
                ) : (
                  <>
                    <MdSave className="mr-2 text-lg" /> GUARDAR ALTERAÇÕES
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
