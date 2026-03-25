import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';
import { MdEmail, MdLock, MdPerson, MdLocalHospital } from 'react-icons/md';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['donor', 'hospital']),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [activeRole, setActiveRole] = useState<'donor' | 'hospital'>('donor');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: 'donor' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    // Mock authentication
    setTimeout(() => {
      const mockUser = data.role === 'donor' ? {
        id: 'd1',
        name: 'Miguel Silva',
        email: data.email,
        role: 'donor',
        bloodType: 'O+',
        totalDonations: 12,
        livesSaved: 36,
        rank: 'Bronze',
      } : {
        id: 'h1',
        name: "St. Luke's Hospital",
        email: data.email,
        role: 'hospital',
        address: 'Rua da Independência, Luanda',
        phone: '+244 923 000 000',
        inventory: {},
      };
      
      login(mockUser);
      navigate(data.role === 'donor' ? '/donor/dashboard' : '/hospital/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-500">
      <Card className="w-full max-w-md border-none shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto size-16 bg-primary/10 dark:bg-primary/20 rounded-3xl flex items-center justify-center mb-4">
            <span className="text-primary text-3xl font-black">B+</span>
          </div>
          <CardTitle className="text-3xl font-black text-slate-900 dark:text-white">Welcome Back</CardTitle>
          <CardDescription className="text-base">Login to your account to continue.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button 
              type="button"
              onClick={() => setActiveRole('donor')}
              className={cn(
                "flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all",
                activeRole === 'donor' 
                  ? "bg-white dark:bg-slate-700 shadow-sm text-primary scale-[1.02]" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              <MdPerson className="text-xl" /> Donor
            </button>
            <button 
              type="button"
              onClick={() => setActiveRole('hospital')}
              className={cn(
                "flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all",
                activeRole === 'hospital' 
                  ? "bg-white dark:bg-slate-700 shadow-sm text-hospital scale-[1.02]" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              <MdLocalHospital className="text-xl" /> Hospital
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <input type="hidden" {...register('role')} value={activeRole} />
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
              <div className="relative group">
                <MdEmail className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 text-xl transition-colors",
                  errors.email ? "text-red-500" : "text-slate-400 group-focus-within:text-primary"
                )} />
                <input 
                  {...register('email')}
                  className={cn(
                    "w-full bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium text-slate-900 dark:text-white",
                    errors.email 
                      ? "border-red-100 dark:border-red-900/30 focus:border-red-500" 
                      : "border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-900"
                  )}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-[10px] font-black uppercase ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
              <div className="relative group">
                <MdLock className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 text-xl transition-colors",
                  errors.password ? "text-red-500" : "text-slate-400 group-focus-within:text-primary"
                )} />
                <input 
                  {...register('password')}
                  type="password"
                  className={cn(
                    "w-full bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium text-slate-900 dark:text-white",
                    errors.password 
                      ? "border-red-100 dark:border-red-900/30 focus:border-red-500" 
                      : "border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-900"
                  )}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-[10px] font-black uppercase ml-1">{errors.password.message}</p>}
            </div>

            <Button 
              type="submit" 
              className={cn(
                "w-full py-8 text-lg rounded-2xl mt-4",
                activeRole === 'hospital' && "bg-hospital hover:bg-blue-700 shadow-hospital/30"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verifying Account...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-slate-500 text-sm font-medium">
            Don't have an account? <button 
              onClick={() => navigate('/register')}
              className="text-primary font-black hover:underline"
            >Create one</button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
