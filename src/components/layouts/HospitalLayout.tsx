import { ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  MdDashboard,
  MdInventory,
  MdGroupAdd,
  MdChat,
  MdNotifications,
  MdSettings,
  MdLogout,
} from 'react-icons/md';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';
import { Hospital } from '@/lib/types';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HospitalLayoutProps {
  children?: ReactNode;
}

export const HospitalLayout = ({ children }: HospitalLayoutProps) => {
  const { user, logout } = useAuthStore();
  const hospital = user as Hospital;

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 sticky top-0 h-screen">
        <div className="p-6">
          <h1 className="text-xl font-black text-hospital flex items-center gap-2">
            <div className="size-8 bg-hospital rounded-lg flex items-center justify-center text-white">
              B+
            </div>
            BLOOD HUB
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <SideNavItem
            to="/hospital/dashboard"
            icon={<MdDashboard />}
            label="Dashboard"
          />
          <SideNavItem
            to="/hospital/stock"
            icon={<MdInventory />}
            label="Blood Stock"
          />
          <SideNavItem
            to="/hospital/donors"
            icon={<MdGroupAdd />}
            label="Manage Donors"
          />
          <SideNavItem
            to="/hospital/messages"
            icon={<MdChat />}
            label="Messages"
          />
          <SideNavItem
            to="/hospital/settings"
            icon={<MdSettings />}
            label="Settings"
          />
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full p-3 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <MdLogout className="text-xl" />
            <span className="font-semibold">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top App Bar */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white md:hidden">
            Blood Hub
          </h2>
          <div className="hidden md:block">
            <h2 className="text-sm font-medium text-slate-500">
              Welcome back,
            </h2>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              {hospital?.name || 'Administrator'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <MdNotifications className="text-2xl text-slate-600 dark:text-slate-300" />
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
              {hospital?.name?.charAt(0) || 'H'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">{children || <Outlet />}</main>

        {/* Mobile Nav */}
        <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-2 shadow-2xl">
          <div className="grid grid-cols-4 gap-1">
            <MobileNavItem
              to="/hospital/dashboard"
              icon={<MdDashboard />}
              label="Dashboard"
            />
            <MobileNavItem
              to="/hospital/stock"
              icon={<MdInventory />}
              label="Stock"
            />
            <MobileNavItem
              to="/hospital/donors"
              icon={<MdGroupAdd />}
              label="Donors"
            />
            <MobileNavItem
              to="/hospital/messages"
              icon={<MdChat />}
              label="Chat"
            />
          </div>
        </nav>
      </div>
    </div>
  );
};

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
        'flex items-center gap-3 p-3 rounded-xl transition-all duration-200 font-semibold',
        isActive
          ? 'bg-hospital/10 text-hospital shadow-sm'
          : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
      )
    }
  >
    <span className="text-xl">{icon}</span>
    <span>{label}</span>
  </NavLink>
);

const MobileNavItem = ({
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
        'flex flex-col items-center justify-center p-2 rounded-lg transition-colors',
        isActive ? 'text-hospital bg-hospital/10' : 'text-slate-400'
      )
    }
  >
    <span className="text-xl">{icon}</span>
    <span className="text-[10px] font-bold">{label}</span>
  </NavLink>
);
