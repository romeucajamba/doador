import { ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  MdDashboard,
  MdMap,
  MdLogout,
  MdLocalHospital,
  MdPerson,
  MdInventory,
  MdNotificationsActive,
  MdEventNote,
  MdChat,
  MdLeaderboard,
  MdHistory,
  MdAdminPanelSettings,
} from 'react-icons/md';
import { cn } from '@/lib/utils';
import { useAdminAuthStore } from '@/hooks/adminAuth';
import { ThemeToggle } from '../ui/ThemeToggle';

interface AdminLayoutProps {
  children?: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { logout, session } = useAdminAuthStore();
  const user = session?.user;

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans">
      <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 sticky top-0 h-screen">
        <div className="p-6 text-center">
          <h1 className="text-xl font-black text-primary flex flex-col items-center justify-center gap-1">
            <span>BLOOD HUB</span>
            <span className="text-xs text-slate-500 uppercase">Admin</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto pb-4 custom-scrollbar">
          <SideNavItem
            to="/admin/dashboard"
            icon={<MdDashboard />}
            label="Dashboard"
          />
          <SideNavItem
            to="/admin/hospitais"
            icon={<MdLocalHospital />}
            label="Hospitais"
          />
          <SideNavItem
            to="/admin/doadores"
            icon={<MdPerson />}
            label="Doadores"
          />
          <SideNavItem
            to="/admin/geografia"
            icon={<MdMap />}
            label="Geografia"
          />
          <SideNavItem to="/admin/stock" icon={<MdInventory />} label="Stock" />
          <SideNavItem
            to="/admin/pedidos"
            icon={<MdNotificationsActive />}
            label="Pedidos"
          />
          <SideNavItem
            to="/admin/agenda"
            icon={<MdEventNote />}
            label="Agenda"
          />
          <SideNavItem
            to="/admin/comunicacao"
            icon={<MdChat />}
            label="Comunicação"
          />
          <SideNavItem
            to="/admin/auditoria"
            icon={<MdHistory />}
            label="Auditoria"
          />
          <SideNavItem
            to="/admin/profile"
            icon={<MdAdminPanelSettings />}
            label="Meu Perfil"
          />
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-slate-800 space-y-4 shrink-0">
          <NavLink
            to="/admin/profile"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 p-3 rounded-2xl transition-all',
                isActive
                  ? 'bg-primary/10 dark:bg-primary/20 ring-1 ring-primary/30'
                  : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
              )
            }
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-dark-text dark:text-white truncate group-hover:text-primary transition-colors">
                {user?.nome_completo || 'Admin'}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </NavLink>

          <button
            onClick={logout}
            className="flex items-center gap-3 w-full p-4 rounded-2xl text-neutral-text hover:bg-primary/5 hover:text-primary transition-all font-black text-xs uppercase tracking-widest group"
          >
            <MdLogout className="text-xl group-hover:translate-x-1 transition-transform" />
            <span>Sair da Conta</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 flex h-20 shrink-0 items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-lg font-black text-primary md:hidden">
            Blood Hub
          </h2>
          <div className="hidden md:block">
            <h2 className="text-xs font-black text-neutral-text uppercase tracking-widest">
              Painel de Administração
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full pb-32 md:pb-10 overflow-x-hidden">
          {children || <Outlet />}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-gray-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
          <div className="flex h-20 items-center justify-start gap-6 px-4 overflow-x-auto custom-scrollbar">
            <NavItem
              to="/admin/dashboard"
              icon={<MdDashboard />}
              label="Início"
            />
            <NavItem
              to="/admin/hospitais"
              icon={<MdLocalHospital />}
              label="Hospitais"
            />
            <NavItem
              to="/admin/doadores"
              icon={<MdPerson />}
              label="Doadores"
            />
            <NavItem to="/admin/geografia" icon={<MdMap />} label="Geografia" />
            <NavItem to="/admin/stock" icon={<MdInventory />} label="Stock" />
            <NavItem
              to="/admin/pedidos"
              icon={<MdNotificationsActive />}
              label="Pedidos"
            />
            <NavItem to="/admin/agenda" icon={<MdEventNote />} label="Agenda" />
            <NavItem
              to="/admin/comunicacao"
              icon={<MdChat />}
              label="Comunicação"
            />
            <NavItem
              to="/admin/gamificacao"
              icon={<MdLeaderboard />}
              label="Gamificação"
            />
            <NavItem
              to="/admin/auditoria"
              icon={<MdHistory />}
              label="Auditoria"
            />
            <NavItem
              to="/admin/profile"
              icon={<MdAdminPanelSettings />}
              label="Perfil"
            />
            <NavItem
              to="/admin/login"
              onClick={logout}
              icon={<MdLogout />}
              label="Sair"
            />
          </div>
        </nav>
      </div>
    </div>
  );
};

const NavItem = ({
  to,
  icon,
  label,
  onClick,
}: {
  to: string;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        'flex flex-col items-center justify-center gap-1 transition-all duration-200',
        isActive
          ? 'text-primary scale-110'
          : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
      )
    }
  >
    <span className="text-2xl">{icon}</span>
    <span className="text-[10px] font-bold uppercase tracking-wider">
      {label}
    </span>
  </NavLink>
);

const SideNavItem = ({
  to,
  icon,
  label,
}: {
  to: string;
  icon: ReactNode;
  label: string;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        'flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 font-black uppercase text-xs tracking-widest',
        isActive
          ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
          : 'text-neutral-text hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-dark-text dark:hover:text-white'
      )
    }
  >
    <span className="text-xl">{icon}</span>
    <span>{label}</span>
  </NavLink>
);
