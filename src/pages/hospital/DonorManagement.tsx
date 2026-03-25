import { useState } from 'react';
import { MdSearch, MdFilterList, MdEmail, MdPhone, MdChevronRight } from 'react-icons/md';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BloodType } from '@/lib/types';
import { cn } from '@/lib/utils';

const MOCK_DONORS = [
  { id: '1', name: 'João Silva', email: 'joao@example.com', phone: '923 000 111', bloodType: 'A+', lastDonated: '2024-03-01', status: 'Ready' },
  { id: '2', name: 'Maria Santos', email: 'maria@example.com', phone: '923 000 222', bloodType: 'O-', lastDonated: '2024-02-15', status: 'Waiting' },
  { id: '3', name: 'Pedro Antunes', email: 'pedro@example.com', phone: '923 000 333', bloodType: 'B+', lastDonated: '2024-01-10', status: 'Ready' },
  { id: '4', name: 'Ana Costa', email: 'ana@example.com', phone: '923 000 444', bloodType: 'AB-', lastDonated: '2024-03-12', status: 'Ready' },
];

export const DonorManagement = () => {
  const [search, setSearch] = useState('');

  const filtered = MOCK_DONORS.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.bloodType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Donor Network</h1>
          <p className="text-slate-500 mt-1 font-medium">Access and engage with your registered donor base.</p>
        </div>
        <Button variant="hospital" className="rounded-xl">
           <MdEmail className="mr-2" /> Broadcast Alert
        </Button>
      </div>

      <div className="flex gap-4">
        <Input 
          placeholder="Search by name or blood type..." 
          icon={<MdSearch />} 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md bg-white dark:bg-slate-900"
        />
        <Button variant="outline" className="h-14 w-14 p-0 rounded-2xl shrink-0">
          <MdFilterList className="text-2xl" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filtered.map((donor) => (
          <Card key={donor.id} className="border-none shadow-xl hover:shadow-2xl transition-all group overflow-hidden rounded-[2rem] bg-white dark:bg-background-dark border border-gray-100 dark:border-gray-800 hover:scale-[1.02] cursor-pointer">
            <CardContent className="p-0">
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center font-black text-2xl text-dark-text dark:text-white group-hover:bg-hospital group-hover:text-white transition-all shadow-sm">
                      {donor.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-dark-text dark:text-white group-hover:text-hospital transition-colors">{donor.name}</h3>
                      <p className="text-[10px] font-black text-neutral-text uppercase tracking-widest mt-1">Life Saver since 2023</p>
                    </div>
                  </div>
                  <div className="size-14 bg-hospital/10 rounded-2xl flex flex-col items-center justify-center text-hospital border border-hospital/20 shadow-sm shadow-hospital/5">
                    <span className="text-sm font-black leading-none">{donor.bloodType}</span>
                    <span className="text-[8px] font-black uppercase mt-1">Type</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-neutral-text dark:text-gray-400 text-sm font-bold bg-gray-50/50 dark:bg-slate-800/50 p-3 rounded-xl border border-gray-50 dark:border-gray-800">
                    <MdEmail className="text-xl text-hospital/60" /> {donor.email}
                  </div>
                  <div className="flex items-center gap-3 text-neutral-text dark:text-gray-400 text-sm font-bold bg-gray-50/50 dark:bg-slate-800/50 p-3 rounded-xl border border-gray-50 dark:border-gray-800">
                    <MdPhone className="text-xl text-hospital/60" /> {donor.phone}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase text-neutral-text tracking-widest leading-none mb-2">Last Donation</p>
                    <p className="text-base font-black text-dark-text dark:text-white">{donor.lastDonated}</p>
                  </div>
                  <Badge 
                    className={cn(
                      "rounded-xl px-4 py-2 font-black uppercase text-[10px] tracking-widest",
                      donor.status === 'Ready' 
                        ? "bg-success/10 text-success border-success/20" 
                        : "bg-warning/10 text-warning border-warning/20"
                    )}
                  >
                    {donor.status}
                  </Badge>
                </div>

                <Button variant="ghost" className="w-full justify-between pr-4 h-14 rounded-2xl hover:bg-hospital/5 text-neutral-text hover:text-hospital transition-all border border-transparent hover:border-hospital/10">
                  <span className="text-xs font-black uppercase tracking-widest">View Analytics</span>
                  <MdChevronRight className="text-2xl" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
