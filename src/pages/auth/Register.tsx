import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';
import { MdEmail, MdLock, MdPerson, MdLocalHospital, MdPhone, MdLocationOn, MdBloodtype } from 'react-icons/md';

const registerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['donor', 'hospital']),
  bloodType: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [activeRole, setActiveRole] = useState<'donor' | 'hospital'>('donor');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'donor' },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    // Mock registration
    setTimeout(() => {
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
      };
      login(mockUser);
      navigate(data.role === 'donor' ? '/donor/dashboard' : '/hospital/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 py-12 transition-colors duration-500">
      <Card className="w-full max-w-lg border-none shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-black text-slate-900 dark:text-white">Join the Community</CardTitle>
          <CardDescription className="text-base">Start saving lives today by creating an account.</CardDescription>
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
                  ? "bg-white dark:bg-slate-700 shadow-sm text-primary" 
                  : "text-slate-500"
              )}
            >
              <MdPerson className="text-xl" /> I'm a Donor
            </button>
            <button 
              type="button"
              onClick={() => setActiveRole('hospital')}
              className={cn(
                "flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all",
                activeRole === 'hospital' 
                  ? "bg-white dark:bg-slate-700 shadow-sm text-hospital" 
                  : "text-slate-500"
              )}
            >
              <MdLocalHospital className="text-xl" /> Hospital
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register('role')} value={activeRole} />
            
            <FormInput 
              label="Full Name / Entity Name" 
              name="name" 
              register={register} 
              error={errors.name} 
              icon={<MdPerson />} 
            />

            <FormInput 
              label="Email Address" 
              name="email" 
              type="email" 
              register={register} 
              error={errors.email} 
              icon={<MdEmail />} 
            />

            <FormInput 
              label="Password" 
              name="password" 
              type="password" 
              register={register} 
              error={errors.password} 
              icon={<MdLock />} 
            />

            {activeRole === 'donor' ? (
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Blood Type</label>
                <div className="relative">
                  <MdBloodtype className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
                  <select 
                    {...register('bloodType')}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 pl-12 pr-4 outline-none appearance-none font-bold text-slate-900 dark:text-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>
            ) : (
              <>
                <FormInput 
                  label="Phone Number" 
                  name="phone" 
                  register={register} 
                  error={errors.phone} 
                  icon={<MdPhone />} 
                />
                <FormInput 
                  label="Address" 
                  name="address" 
                  register={register} 
                  error={errors.address} 
                  icon={<MdLocationOn />} 
                />
              </>
            )}

            <Button 
              type="submit" 
              className={cn(
                "w-full py-8 text-lg rounded-2xl mt-4",
                activeRole === 'hospital' && "bg-hospital hover:bg-blue-700 shadow-hospital/30"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Secure Account...' : 'Continue Registration'}
            </Button>
          </form>

          <p className="text-center text-slate-500 text-sm font-medium">
            Already have an account? <button 
              onClick={() => navigate('/login')}
              className="text-primary font-black hover:underline"
            >Sign in</button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const FormInput = ({ label, name, type = "text", register, error, icon }: any) => (
  <div className="space-y-2">
    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">{label}</label>
    <div className="relative group">
      <span className={cn(
        "absolute left-4 top-1/2 -translate-y-1/2 text-xl transition-colors",
        error ? "text-red-500" : "text-slate-400 group-focus-within:text-primary"
      )}>{icon}</span>
      <input 
        {...register(name)}
        type={type}
        className={cn(
          "w-full bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium text-slate-900 dark:text-white",
          error 
            ? "border-red-100 dark:border-red-900/30 focus:border-red-500" 
            : "border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-900"
        )}
      />
    </div>
    {error && <p className="text-red-500 text-[10px] font-black uppercase ml-1">{error.message}</p>}
  </div>
);
