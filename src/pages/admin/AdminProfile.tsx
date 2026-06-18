import { useState } from 'react';
import { useAdminAuthStore } from '@/hooks/adminAuth';
import { useUpdateAdmin } from '@/service/admin/profile';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  MdPerson,
  MdEmail,
  MdLock,
  MdSave,
  MdAdminPanelSettings,
} from 'react-icons/md';

export const AdminProfile = () => {
  const { session, updateUser } = useAdminAuthStore();
  const user = session?.user;

  const updateProfile = useUpdateAdmin(user?.id_admin || 0);

  const [nomeCompleto, setNomeCompleto] = useState(user?.nome_completo || '');
  const [email, setEmail] = useState(user?.email || '');
  const [senha, setSenha] = useState('');

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload: any = {
        nome_completo: nomeCompleto,
        email,
      };

      if (senha) {
        payload.senha = senha;
      }

      const updatedData = await updateProfile.mutateAsync(payload);

      updateUser({
        nome_completo: updatedData.nome_completo,
        email: updatedData.email,
      });

      setSuccess('Perfil atualizado com sucesso!');
      setSenha('');
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
        <h1 className="text-3xl font-black text-dark-text dark:text-white tracking-tight flex items-center gap-2">
          <MdAdminPanelSettings className="text-primary" /> Meu Perfil
        </h1>
        <p className="text-neutral-text font-medium text-lg">
          Gerencie as suas informações de acesso e credenciais de administrador.
        </p>
      </div>

      <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl font-black text-primary flex items-center gap-2">
            <MdPerson /> Dados da Conta
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
              <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-bold rounded-xl border border-green-100 dark:border-green-900/50">
                {success}
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="nome_completo"
                className="flex items-center gap-2"
              >
                <MdPerson className="text-slate-400" /> Nome Completo
              </Label>
              <Input
                id="nome_completo"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                required
                className="w-full bg-white dark:bg-slate-950"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <MdEmail className="text-slate-400" /> E-mail de Acesso
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

            <div className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-dark-text dark:text-white flex items-center gap-2">
                  <MdLock className="text-primary" /> Alterar Palavra-passe
                </h3>
                <p className="text-xs text-slate-500">
                  Deixe em branco se não quiser alterar a senha atual.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Nova Palavra-passe</Label>
                <Input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-slate-950"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button
                type="submit"
                disabled={updateProfile.isPending}
                className="font-black px-8"
              >
                {updateProfile.isPending ? (
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
