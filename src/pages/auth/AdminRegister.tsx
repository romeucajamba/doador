import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminRegister } from '@/service/admin/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { MdAdminPanelSettings } from 'react-icons/md';

export const AdminRegister = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { mutateAsync: register, isPending } = useAdminRegister();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register({ nome_completo: nome, email, senha });
      alert('Administrador criado com sucesso! Faça login para continuar.');
      navigate('/admin/login', { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Erro ao registar o administrador. Tente novamente.'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-800">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MdAdminPanelSettings className="text-4xl text-primary" />
          </div>
          <h2 className="text-3xl font-black text-dark-text dark:text-white tracking-tight">
            Criar Admin
          </h2>
          <p className="text-sm font-medium text-neutral-text">
            Adicione um novo administrador ao sistema.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6 mt-8">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl border border-red-100 dark:border-red-900/50 text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João Silva"
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bloodhub.com"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Palavra-passe</Label>
              <Input
                id="password"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-black tracking-wide"
            disabled={isPending}
          >
            {isPending ? 'A REGISTAR...' : 'CRIAR CONTA'}
          </Button>

          <div className="text-center mt-6 space-y-4">
            <p className="text-sm text-slate-500">
              Já tem uma conta de administrador?{' '}
              <Link to="/admin/login" className="font-bold text-primary hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
