import { ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  MdDashboard, 
  MdLocationOn, 
  MdCalendarMonth, 
  MdPerson,
  MdNotifications,
  MdLogout
} from 'react-icons/md';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';
import { Donor } from '@/lib/types';
import { ThemeToggle } from '../ui/ThemeToggle';
import { NotificationBell } from '../donor/NotificationBell';

interface DonorLayoutProps {
  children?: ReactNode;
}

export const DonorLayout = ({ children }: DonorLayoutProps) => {
  const { user, logout } = useAuthStore();
  const donor = user as Donor;

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 sticky top-0 h-screen">
        <div className="p-6 text-center">
          <h1 className="text-xl font-black text-primary flex items-center justify-center gap-2">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">B+</div>
            BLOOD HUB
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <SideNavItem to="/donor/dashboard" icon={<MdDashboard />} label="Dashboard" />
          <SideNavItem to="/donor/centers" icon={<MdLocationOn />} label="Centros" />
          <SideNavItem to="/donor/appointments" icon={<MdCalendarMonth />} label="Agenda" />
          <SideNavItem to="/donor/profile" icon={<MdPerson />} label="Perfil" />
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
              {donor?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-dark-text dark:text-white truncate">{donor?.name || 'Usuário'}</p>
              <p className="text-[10px] text-neutral-text font-bold uppercase tracking-widest">{donor?.bloodType || 'O+'}</p>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full p-4 rounded-2xl text-neutral-text hover:bg-primary/5 hover:text-primary transition-all font-black text-xs uppercase tracking-widest group"
          >
            <MdLogout className="text-xl group-hover:translate-x-1 transition-transform" />
            <span>Sair da Conta</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top App Bar */}
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-lg font-black text-primary md:hidden">Blood Hub</h2>
          <div className="hidden md:block">
            <h2 className="text-xs font-black text-neutral-text uppercase tracking-widest">Seja bem-vindo,</h2>
            <p className="text-lg font-black text-dark-text dark:text-white">{donor?.name || 'Usuário'}</p>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <NotificationBell />
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full pb-32 md:pb-10">
          {children || <Outlet />}
        </main>

        {/* Mobile Nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-gray-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
          <div className="flex h-20 items-center justify-around px-4">
            <NavItem to="/donor/dashboard" icon={<MdDashboard />} label="Início" />
            <NavItem to="/donor/centers" icon={<MdLocationOn />} label="Centros" />
            <NavItem to="/donor/appointments" icon={<MdCalendarMonth />} label="Agenda" />
            <NavItem to="/donor/profile" icon={<MdPerson />} label="Perfil" />
          </div>
        </nav>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string; icon: ReactNode; label: string }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => cn(
      "flex flex-col items-center justify-center gap-1 transition-all duration-200",
      isActive ? "text-primary scale-110" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
    )}
  >
    <span className="text-2xl">{icon}</span>
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </NavLink>
);

const SideNavItem = ({ to, icon, label }: { to: string; icon: ReactNode; label: string }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => cn(
      "flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 font-black uppercase text-xs tracking-widest",
      isActive 
        ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" 
        : "text-neutral-text hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-dark-text dark:hover:text-white"
    )}
  >
    <span className="text-xl">{icon}</span>
    <span>{label}</span>
  </NavLink>
);
