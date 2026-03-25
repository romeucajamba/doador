import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, error, ...props }, ref) => {
    return (
      <div className="relative group w-full">
        {icon && (
          <div
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2 text-xl transition-colors',
              error
                ? 'text-red-500'
                : 'text-slate-400 group-focus-within:text-primary'
            )}
          >
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-14 w-full rounded-2xl border-2 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm font-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary/30 focus-visible:bg-white dark:focus-visible:bg-slate-800 transition-all disabled:cursor-not-allowed disabled:opacity-50',
            icon && 'pl-12',
            error ? 'border-red-500/30' : 'border-transparent',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
