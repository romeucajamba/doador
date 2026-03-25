import { useState } from 'react';
import { MdAdd, MdRemove, MdHistory, MdTune, MdWarning } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useInventoryStore } from '@/stores/useInventoryStore';
import { BloodType } from '@/lib/types';
import { cn } from '@/lib/utils';

export const StockManagement = () => {
  const { stock, updateStock } = useInventoryStore();

  // Tipagem segura para as chaves do objeto
  const stockEntries = Object.entries(stock) as [BloodType, number][];

  const handleAdjust = (type: BloodType, delta: number) => {
    const currentStock = stock[type] ?? 0;
    updateStock(type, Math.max(0, currentStock + delta));
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Responsivo */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Controle de Inventário
          </h1>
          <p className="text-slate-500 text-sm md:text-base font-medium">
            Gerencie as unidades de sangue e limites de alerta.
          </p>
        </motion.div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg shadow-sm border-slate-200"
          >
            <MdHistory className="mr-2 h-4 w-4" /> Histórico
          </Button>
          <Button
            variant="default"
            size="sm"
            className="rounded-lg shadow-md bg-red-600 hover:bg-red-700"
          >
            <MdTune className="mr-2 h-4 w-4" /> Ajustes
          </Button>
        </div>
      </header>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        <AnimatePresence>
          {stockEntries.map(([type, units], index) => {
            const isLow = units < 20;

            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={cn(
                    'relative overflow-hidden transition-all duration-300 rounded-xl border-slate-200 shadow-sm hover:shadow-md',
                    isLow ? 'border-red-200 bg-red-50/30' : 'bg-white'
                  )}
                >
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center mb-6">
                      <div
                        className={cn(
                          'size-12 rounded-lg flex items-center justify-center text-xl font-bold transition-colors',
                          isLow
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                        )}
                      >
                        {type}
                      </div>

                      <div className="text-right">
                        <motion.span
                          key={units}
                          initial={{ scale: 1.2, color: '#ef4444' }}
                          animate={{ scale: 1, color: 'inherit' }}
                          className="text-4xl font-bold block"
                        >
                          {units}
                        </motion.span>
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                          Unidades
                        </span>
                      </div>
                    </div>

                    {/* Alerta de Estoque Baixo */}
                    <div className="h-8 mb-4">
                      {isLow && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-center gap-2 text-red-600 bg-red-100/50 py-1 rounded-md border border-red-200"
                        >
                          <MdWarning className="size-3" />
                          <span className="text-[10px] font-bold uppercase">
                            Crítico
                          </span>
                        </motion.div>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="flex-1 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        onClick={() => handleAdjust(type, -1)}
                      >
                        <MdRemove />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="flex-1 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        onClick={() => handleAdjust(type, 1)}
                      >
                        <MdAdd />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
