import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuthStore } from '@/hooks/adminAuth';
import { useAdminLogin } from '@/service/admin/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { MdAdminPanelSettings } from 'react-icons/md';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const setAuth = useAdminAuthStore((s) => s.setAuth);
  const { mutateAsync: login, isPending } = useAdminLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await login({ email, senha });
      setAuth(response);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Erro ao efetuar login. Verifique as suas credenciais.'
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
            Painel Admin
          </h2>
          <p className="text-sm font-medium text-neutral-text">
            Acesso restrito a administradores do sistema.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 mt-8">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl border border-red-100 dark:border-red-900/50 text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
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
            {isPending ? 'A ENTRAR...' : 'ENTRAR NO SISTEMA'}
          </Button>

          <div className="text-center mt-6 space-y-4">
            <p className="text-sm text-slate-500">
              Não tem uma conta?{' '}
              <Link
                to="/admin/register"
                className="font-bold text-primary hover:underline"
              >
                Criar Admin
              </Link>
            </p>
            <div>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sm font-bold text-slate-400 hover:text-primary transition-colors"
              >
                Voltar ao Login Principal
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
