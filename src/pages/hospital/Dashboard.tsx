import { useState } from 'react';
import { MdEvent, MdGroup, MdAdd, MdAnalytics, MdBloodtype, MdLocalShipping, MdPriorityHigh, MdCheckCircle } from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useInventoryStore } from '@/stores/useInventoryStore';
import { BloodType } from '@/lib/types';
import { cn } from '@/lib/utils';

export const HospitalDashboard = () => {
  const stock = useInventoryStore((state) => state.stock);
  const [isRequesting, setIsRequesting] = useState(false);
  const [showStatus, setShowStatus] = useState<'success' | 'none'>('none');

  const handleEmergencyRequest = () => {
    setIsRequesting(true);
    setTimeout(() => {
      setIsRequesting(false);
      setShowStatus('success');
      setTimeout(() => setShowStatus('none'), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative">
        {showStatus === 'success' && (
          <div className="absolute top-full mt-4 right-0 z-50 bg-success text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 font-bold">
            <MdCheckCircle className="text-2xl" /> Emergency broadcast sent to all compatible donors!
          </div>
        )}
        <div>
          <h1 className="text-4xl font-black text-dark-text dark:text-white tracking-tight">Hospital Command Center</h1>
          <p className="text-neutral-text mt-2 font-medium text-lg">Real-time blood bank telemetry & donor management.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl h-14 px-8 font-bold border-gray-200">
            Export Data
          </Button>
          <Button 
            onClick={handleEmergencyRequest}
            disabled={isRequesting}
            variant="hospital" size="lg" className="shadow-hospital/30 rounded-2xl h-14 px-8 font-bold bg-hospital hover:bg-blue-700 text-white min-w-[280px]"
          >
            {isRequesting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></span>
                Processing Emergency...
              </span>
            ) : (
              <><MdAdd className="mr-2 text-2xl" /> Create Emergency Request</>
            )}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard label="Total Units in Stock" value="450" color="info" subValue="+12% from last week" />
        <MetricCard label="Urgent Cross-matches" value="2" color="primary" subValue="Immediate action required" />
        <MetricCard label="Donor Verifications" value="15" color="neutral-text" subValue="Pending review" />
        <MetricCard label="Active Campaigns" value="3" color="info" subValue="Running in Luanda" />
      </div>

      {/* Stock Overview */}
      <Card className="border-none shadow-xl overflow-hidden bg-white dark:bg-background-dark rounded-3xl">
        <CardHeader className="p-8 pb-4 border-b border-gray-100 dark:border-gray-800 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-black text-dark-text dark:text-white">Blood Stock Levels</CardTitle>
            <p className="text-sm text-neutral-text font-medium mt-1">Real-time inventory levels across all types.</p>
          </div>
          <Button variant="ghost" className="text-hospital font-black">View detailed inventory</Button>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-8">
            {(Object.entries(stock) as [BloodType, number][]).map(([type, units]) => (
              <div key={type} className="flex flex-col items-center gap-4 group cursor-help transition-all hover:scale-105">
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 relative overflow-hidden shadow-inner">
                  <div 
                    className={cn(
                      "absolute top-0 left-0 h-full rounded-full transition-all duration-1000",
                      units < 20 ? "bg-primary shadow-[0_0_10px_rgba(229,57,51,0.5)]" : "bg-hospital shadow-[0_0_10px_rgba(45,100,162,0.3)]"
                    )}
                    style={{ width: `${Math.min(units, 100)}%` }}
                  ></div>
                </div>
                <div className="text-center">
                  <p className={cn("text-xl font-black transition-colors", units < 20 ? "text-primary" : "text-dark-text dark:text-white")}>
                    {type}
                  </p>
                  <div className="flex flex-col items-center">
                    <p className="text-xs font-black text-neutral-text uppercase">{units} Units</p>
                    <span className={cn(
                      "text-[8px] font-bold px-1.5 py-0.5 rounded mt-1",
                      units < 20 ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                    )}>
                      {units < 20 ? 'CRITICAL' : 'STABLE'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-black text-dark-text dark:text-white text-lg px-2">Quick Commands</h3>
          <div className="grid grid-cols-2 gap-3">
            <ActionBtn icon={<MdEvent />} label="Schedule Drive" />
            <ActionBtn icon={<MdGroup />} label="Manage Donors" />
            <ActionBtn icon={<MdAnalytics />} label="Global Reports" />
            <ActionBtn icon={<MdLocalShipping />} label="Transfers" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-black text-dark-text dark:text-white text-lg px-2">Live Activity Feed</h3>
          <div className="space-y-3">
            <ActivityItem 
              icon={<MdBloodtype className="text-success" />}
              title="New Donation Received"
              desc="Donor: João Silva (A+)"
              time="10:30 AM"
              tag="+2 Units"
              tagColor="green"
            />
            <ActivityItem 
              icon={<MdLocalShipping className="text-info" />}
              title="Outbound Transfer"
              desc="To: Hospital Central (O-)"
              time="Yesterday, 4:15 PM"
              tag="-10 Units"
              tagColor="blue"
            />
            <ActivityItem 
              icon={<MdPriorityHigh className="text-primary" />}
              title="Urgent Alert Created"
              desc="Stock for AB+ critical"
              time="Yesterday, 9:00 AM"
              tag="CRITICAL"
              tagColor="red"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, color, subValue }: any) => (
  <Card className="border-none shadow-xl bg-white dark:bg-background-dark p-8 group hover:scale-[1.02] transition-all cursor-pointer rounded-3xl">
    <CardContent className="p-0">
      <div className="flex justify-between items-start">
        <p className="text-neutral-text dark:text-gray-400 font-black text-xs uppercase tracking-widest">{label}</p>
        <div className={cn(
          "size-2 rounded-full animate-pulse",
          color === 'primary' ? "bg-primary" : 
          color === 'info' ? "bg-info" : "bg-neutral-text"
        )}></div>
      </div>
      <p className={cn(
        "text-5xl font-black mt-4 tracking-tighter",
        color === 'primary' ? "text-primary" : 
        color === 'info' ? "text-info" : "text-dark-text dark:text-white"
      )}>{value}</p>
      {subValue && <p className="text-xs font-bold text-neutral-text mt-2 italic">{subValue}</p>}
    </CardContent>
  </Card>
);

const ActionBtn = ({ icon, label }: any) => (
  <button className="flex flex-col items-center justify-center p-6 rounded-[2rem] bg-white dark:bg-background-dark border border-gray-100 dark:border-gray-800 shadow-xl hover:border-hospital/30 hover:shadow-hospital/10 transition-all group lg:min-h-[140px]">
    <span className="text-4xl text-hospital mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform">{icon}</span>
    <span className="text-xs font-black text-dark-text dark:text-white uppercase tracking-tighter">{label}</span>
  </button>
);

const ActivityItem = ({ icon, title, desc, time, tag, tagColor }: any) => (
  <div className="flex items-center gap-6 p-6 bg-white dark:bg-background-dark rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all cursor-pointer group">
    <div className={`size-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-hospital group-hover:text-white transition-colors`}>
      <span className="text-3xl">{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-lg text-dark-text dark:text-white truncate">{title}</p>
      <p className="text-sm text-neutral-text font-medium mt-1">{desc} • {time}</p>
    </div>
    <span className={cn(
      "text-xs font-black px-4 py-2 rounded-xl uppercase tracking-widest",
      tagColor === 'green' ? "bg-success/10 text-success" : 
      tagColor === 'blue' ? "bg-info/10 text-info" : "bg-primary/10 text-primary"
    )}>
      {tag}
    </span>
  </div>
);
