import { useState } from 'react';
import {
  MdNotifications,
  MdCheckCircle,
  MdInfo,
  MdWarning,
  MdError,
  MdClose,
} from 'react-icons/md';
import {
  useNotificationStore,
  Notification,
} from '@/stores/useNotificationStore';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/hooks/auth';
import { useDonorNotifications } from '@/service/donor/notifications';

export const NotificationBell = () => {
  const { markAsRead, markAllAsRead } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);

  const { session } = useAuthStore();
  const user = session?.user;

  const { data: notifications = [] } = useDonorNotifications(user?.id_doador);

  const unreadCount = notifications.filter((n) => !n.status_envio).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'sucesso':
        return <MdCheckCircle className="text-success" />;
      case 'erro':
        return <MdError className="text-destructive" />;
      default:
        return <MdInfo className="text-info" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <MdNotifications className="text-2xl text-neutral-text dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 size-4 bg-primary text-white text-[10px] font-bold rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center animate-in zoom-in">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-black text-dark-text dark:text-white uppercase tracking-widest text-xs">
                Notifications
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter"
                  >
                    Mark all as read
                  </button>
                )}
                {/* Botão fechar */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-neutral-text dark:text-gray-400"
                >
                  <MdClose className="text-base" />
                </button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-neutral-text text-sm font-medium italic">
                    No notifications yet.
                  </p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id_notificacao}
                    onClick={() => {
                      markAsRead(String(n.id_notificacao));
                    }}
                    className={cn(
                      'p-4 border-b border-gray-50 dark:border-slate-800/50 flex gap-3 cursor-pointer transition-colors',
                      !n.status_envio
                        ? 'bg-primary/5 dark:bg-primary/10'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    )}
                  >
                    <div className="text-xl mt-1 shrink-0">
                      {getIcon(n.status_envio ?? 'sucesso')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p
                          className={cn(
                            'font-bold text-sm truncate',
                            !n.status_envio
                              ? 'text-dark-text dark:text-white'
                              : 'text-neutral-text'
                          )}
                        ></p>
                        {!n.status_envio && (
                          <div className="size-2 bg-primary rounded-full shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-text line-clamp-2 leading-relaxed mb-1">
                        {n.mensagem_enviada}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
