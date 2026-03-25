import { useState } from 'react';
import { MdAdd, MdRemove, MdHistory, MdTune } from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useInventoryStore } from '@/stores/useInventoryStore';
import { BloodType } from '@/lib/types';
import { cn } from '@/lib/utils';

export const StockManagement = () => {
  const { stock, updateStock } = useInventoryStore();
  const [selectedType, setSelectedType] = useState<BloodType | null>(null);

  const handleAdjust = (type: BloodType, delta: number) => {
    updateStock(type, Math.max(0, stock[type] + delta));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Inventory Control</h1>
          <p className="text-slate-500 mt-1 font-medium">Fine-tune your blood bank units and thresholds.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl">
             <MdHistory className="mr-2" /> History
          </Button>
          <Button variant="hospital" className="rounded-xl">
             <MdTune className="mr-2" /> Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {(Object.entries(stock) as [BloodType, number][]).map(([type, units]) => (
          <Card 
            key={type} 
            className={cn(
              "p-8 relative group transition-all rounded-[2rem] border-none shadow-xl bg-white dark:bg-background-dark hover:scale-[1.02] cursor-pointer",
              units < 20 ? "ring-2 ring-primary/20 bg-primary/[0.02]" : "hover:shadow-2xl"
            )}
          >
            <div className="flex justify-between items-start mb-8">
              <div className="size-16 bg-dark-text dark:bg-white rounded-3xl flex items-center justify-center text-white dark:text-dark-text text-3xl font-black shadow-2xl group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                {type}
              </div>
              <div className="text-right">
                <p className="text-5xl font-black text-dark-text dark:text-white leading-none tracking-tighter">{units}</p>
                <p className="text-[10px] font-black uppercase text-neutral-text tracking-widest mt-2">Units in Bank</p>
              </div>
            </div>

            {units < 20 && (
              <div className="mb-6 bg-primary/10 text-primary p-3 rounded-2xl text-[10px] font-black text-center uppercase tracking-widest animate-pulse border border-primary/20">
                CRITICAL LOW STOCK
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                className="flex-1 h-14 rounded-2xl border-gray-100 dark:border-gray-800 hover:bg-primary/5 hover:text-primary transition-all font-black text-xl"
                onClick={() => handleAdjust(type, -1)}
              >
                <MdRemove />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="flex-1 h-14 rounded-2xl border-gray-100 dark:border-gray-800 hover:bg-info/5 hover:text-info transition-all font-black text-xl"
                onClick={() => handleAdjust(type, 1)}
              >
                <MdAdd />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
