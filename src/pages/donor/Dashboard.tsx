import { useState } from 'react';
import { MdBloodtype, MdFavorite, MdHistory, MdVerified, MdCheckCircle } from 'react-icons/md';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppointmentStore } from '@/stores/useAppointmentStore';
import { Donor } from '@/lib/types';

export const DonorDashboard = () => {
  const user = useAuthStore((state) => state.user) as Donor;
  const appointments = useAppointmentStore((state) => state.appointments);
  const [isScheduling, setIsScheduling] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSchedule = () => {
    setIsScheduling(true);
    setTimeout(() => {
      setIsScheduling(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-black text-dark-text dark:text-white leading-tight">
          Ready to Save a Life!
        </h1>
        <p className="text-neutral-text font-bold md:text-lg">
          Welcome back, {user?.name.split(' ')[0]}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Eligibility Card */}
        <Card className="lg:col-span-2 bg-success/10 dark:bg-success/20 border-success/30 overflow-hidden shadow-none h-full relative">
          {showSuccess && (
            <div className="absolute inset-0 bg-success/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-white animate-in fade-in zoom-in duration-500 p-8 text-center">
              <MdCheckCircle className="text-7xl mb-4" />
              <h3 className="text-3xl font-black mb-2">Excellent!</h3>
              <p className="text-lg font-bold opacity-90">Your donation has been pre-scheduled. Check your appointments for details.</p>
            </div>
          )}
          <CardContent className="p-8 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="size-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center">
                  <MdVerified className="text-success text-3xl" />
                </div>
                <p className="text-success font-black text-xl">Eligible to Donate</p>
              </div>
              <p className="text-neutral-text dark:text-gray-300 text-lg leading-relaxed mb-8 font-medium">
                Your {user?.bloodType || 'O+'} blood is in high demand in the Luanda region. You can make a difference today and save up to 3 lives.
              </p>
            </div>
            <Button 
              onClick={handleSchedule}
              disabled={isScheduling}
              className="w-full md:w-max px-12 py-7 bg-primary text-white font-bold text-lg rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all" size="lg"
            >
              {isScheduling ? 'Connecting to donor network...' : 'Schedule Donation'}
            </Button>
          </CardContent>
        </Card>

        {/* Ranks/Gamification */}
        <Card className="p-8 flex flex-col justify-center gap-6 h-full">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-neutral-text text-xs font-black uppercase tracking-widest mb-1">Current Status</p>
                <p className="text-2xl font-black text-dark-text dark:text-white">{user?.rank || 'Bronze'} Donor</p>
              </div>
              <div className="size-16 bg-info/10 rounded-2xl flex items-center justify-center text-info text-3xl">
                🏆
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-neutral-text">Progress</span>
                <span className="text-info">45%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3">
                <div className="bg-info h-3 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(30,136,229,0.3)]" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <p className="text-neutral-text dark:text-gray-400 text-sm font-medium italic">
              3 donations away from reaching Silver rank! You're doing great!
            </p>
          </div>
        </Card>
      </div>

      {/* Impact Stats */}
      <section>
        <h3 className="text-xl font-black text-dark-text dark:text-white mb-6">Your Global Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ImpactCard 
            icon={<MdBloodtype className="text-primary text-3xl" />}
            value={user?.totalDonations?.toString() || "12"}
            label="Total Donations"
            bgColor="bg-primary/10"
          />
          <ImpactCard 
            icon={<MdFavorite className="text-info text-3xl" />}
            value={user?.livesSaved?.toString() || "36"}
            label="Lives Saved"
            bgColor="bg-info/10"
          />
          <ImpactCard 
            icon={<span className="text-2xl">🌍</span>}
            value="3"
            label="Centers Visited"
            bgColor="bg-gray-100 dark:bg-gray-800"
          />
          <ImpactCard 
            icon={<span className="text-2xl">⭐</span>}
            value="450"
            label="Points Earned"
            bgColor="bg-warning/10"
          />
        </div>
      </section>

      {/* Ranks/Gamification is now part of the top grid */}

      {/* Recent Activity */}
      <section className="pb-12">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-black text-dark-text dark:text-white">Recent Activity</h3>
          <Button variant="ghost" className="text-info font-bold text-sm">View full history</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.slice(0, 6).map((apt) => (
            <Card key={apt.id} className="p-6 border-none shadow-sm hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer group">
              <div className="flex items-center gap-5">
                <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <MdHistory className="text-3xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-lg text-dark-text dark:text-white truncate">{apt.hospitalName}</p>
                  <p className="text-sm text-neutral-text dark:text-gray-400 font-medium">{apt.date} - {apt.type}</p>
                </div>
                <Badge className="text-[10px] font-black uppercase tracking-widest text-success bg-success/10 px-3 py-1.5 rounded-xl">
                  {apt.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

const ImpactCard = ({ icon, value, label, bgColor }: any) => (
  <Card className="border-none shadow-sm">
    <CardContent className="p-4 flex flex-col gap-2">
      <div className={`size-10 ${bgColor} rounded-full flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">{label}</p>
      </div>
    </CardContent>
  </Card>
);
