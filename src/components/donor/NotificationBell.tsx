import { useState } from 'react';
import { MdNotifications, MdCheckCircle, MdInfo, MdWarning, MdError } from 'react-icons/md';
import { useNotificationStore, Notification } from '@/stores/useNotificationStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export const NotificationBell = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <MdCheckCircle className="text-success" />;
      case 'warning': return <MdWarning className="text-warning" />;
      case 'error': return <MdError className="text-destructive" />;
      default: return <MdInfo className="text-info" />;
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
              <h3 className="font-black text-dark-text dark:text-white uppercase tracking-widest text-xs">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-neutral-text text-sm font-medium italic">No notifications yet.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n.id}
                    onClick={() => {
                      markAsRead(n.id);
                    }}
                    className={cn(
                      "p-4 border-b border-gray-50 dark:border-slate-800/50 flex gap-3 cursor-pointer transition-colors",
                      !n.read ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    )}
                  >
                    <div className="text-xl mt-1 shrink-0">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className={cn("font-bold text-sm truncate", !n.read ? "text-dark-text dark:text-white" : "text-neutral-text")}>
                          {n.title}
                        </p>
                        {!n.read && <div className="size-2 bg-primary rounded-full shrink-0 mt-1.5" />}
                      </div>
                      <p className="text-xs text-neutral-text line-clamp-2 leading-relaxed mb-1">
                        {n.message}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {n.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 text-center">
              <button className="text-[10px] font-black text-dark-text dark:text-white uppercase tracking-widest hover:underline">
                View all activity
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
