import { useState } from 'react';
import { MdAdd, MdRemove, MdWarning, MdOpacity, MdClose } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useHospitalAuthStore } from '@/hooks/hospitalAuth';
import {
  useHospitalStock,
  useAddStock,
  useDecrementStock,
  useCreateStock,
} from '@/service/hospital/hospital';
import { TipoSanguineo, StockItem } from '@/types/hospital';
import { TIPO_LABEL, ALL_TYPES } from '@/constants/index';

export const StockManagement = () => {
  const user = useHospitalAuthStore((s) => s.user);
  const id_hospital = user?.id_hospital;

  const {
    data: stock = [],
    isLoading,
    isError,
  } = useHospitalStock(id_hospital);
  const { mutateAsync: addStockAsync, isPending: isAdding } = useAddStock(id_hospital);
  const { mutateAsync: decrementStockAsync, isPending: isDecrementing } = useDecrementStock(id_hospital);
  const { mutateAsync: createStockAsync, isPending: isCreating } = useCreateStock(id_hospital);

  const [showAddModal, setShowAddModal] = useState(false);

  const existingTypes = new Set(stock.map((s) => s.tipo_sanguineo));
  const missingTypes = ALL_TYPES.filter((t) => !existingTypes.has(t));

  const totalBolsas = stock.reduce((acc, s) => acc + s.quantidade_bolsas, 0);
  const tiposCriticos = stock.filter((s) => s.quantidade_bolsas < 5).length;

  const handleAdd = async (tipo: TipoSanguineo) => {
    if (!id_hospital) return;

    const existing = stock.find((s) => s.tipo_sanguineo === tipo);

    try {
      if (existing) {
        await addStockAsync({ id_stock: existing.id_stock, quantidade: 1 });
      } else {
        await createStockAsync({ id_hospital, tipo_sanguineo: tipo, quantidade_bolsas: 1 });
      }
      setShowAddModal(false);
    } catch (error) {
      console.error('Erro ao adicionar tipo de sangue:', error);
      alert('Não foi possível adicionar o tipo de sangue. Tente novamente.');
    }
  };

  const handleDecrement = async (item: StockItem) => {
    if (item.quantidade_bolsas <= 0) return;
    try {
      await decrementStockAsync({ id_stock: item.id_stock });
    } catch (error) {
      console.error('Erro ao remover bolsa:', error);
    }
  };

  const handleIncrement = async (item: StockItem) => {
    if (!id_hospital) return;
    try {
      await addStockAsync({ id_stock: item.id_stock, quantidade: 1 });
    } catch (error) {
      console.error('Erro ao adicionar bolsa:', error);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Controle de Inventário
          </h1>
          <p className="text-slate-500 text-sm md:text-base font-medium">
            Gerencie as unidades de sangue disponíveis no hospital.
          </p>
        </motion.div>

        {missingTypes.length > 0 && (
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl shadow-sm"
            disabled={isAdding}
          >
            <MdAdd className="text-lg" />
            Adicionar Tipo
          </Button>
        )}
      </header>

      {/* Resumo */}
      {stock.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        >
          <SummaryCard label="Tipos registados" value={stock.length} />
          <SummaryCard label="Total de bolsas" value={totalBolsas} />
          <SummaryCard
            label="Tipos críticos"
            value={tiposCriticos}
            alert={tiposCriticos > 0}
          />
        </motion.div>
      )}

      {/* Estado: carregando */}
      {isLoading && (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Estado: sem stock */}
      {!isLoading && stock.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 gap-4 text-center"
        >
          <div className="size-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <MdOpacity className="text-3xl text-slate-400" />
          </div>
          <div>
            <p className="font-bold text-slate-700 dark:text-slate-300 text-lg">
              Nenhum stock registado
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Adicione o primeiro tipo sanguíneo para começar a gerir o
              inventário.
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="mt-2 rounded-xl"
            disabled={isAdding}
          >
            <MdAdd className="mr-2" /> Adicionar Tipo Sanguíneo
          </Button>
        </motion.div>
      )}

      {/* Grid de cards */}
      {!isLoading && stock.length > 0 && (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence>
            {stock.map((item, index) => {
              const isCritical = item.quantidade_bolsas < 5;
              const isEmpty = item.quantidade_bolsas === 0;

              return (
                <motion.div
                  key={item.id_stock}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Card
                    className={cn(
                      'relative overflow-hidden transition-all duration-300 rounded-xl shadow-sm hover:shadow-md',
                      isCritical
                        ? 'border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50'
                    )}
                  >
                    <CardContent className="p-5">
                      {/* Tipo e quantidade */}
                      <div className="flex justify-between items-center mb-5">
                        <div
                          className={cn(
                            'size-12 rounded-xl flex items-center justify-center font-black text-lg transition-colors',
                            isCritical
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                          )}
                        >
                          {TIPO_LABEL[item.tipo_sanguineo]}
                        </div>

                        <div className="text-right">
                          <motion.span
                            key={item.quantidade_bolsas}
                            initial={{ scale: 1.15 }}
                            animate={{ scale: 1 }}
                            className={cn(
                              'text-4xl font-bold block tabular-nums',
                              isCritical
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-slate-900 dark:text-white'
                            )}
                          >
                            {item.quantidade_bolsas}
                          </motion.span>
                          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                            Bolsas
                          </span>
                        </div>
                      </div>

                      {/* Alerta crítico */}
                      <div className="h-7 mb-4">
                        <AnimatePresence>
                          {isCritical && (
                            <motion.div
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center justify-center gap-1.5 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800"
                            >
                              <MdWarning className="text-red-600 dark:text-red-400 text-sm" />
                              <span className="text-[10px] font-bold uppercase text-red-600 dark:text-red-400 tracking-wide">
                                {isEmpty ? 'Esgotado' : 'Crítico'}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Última actualização */}
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-3 text-center">
                        Actualizado:{' '}
                        {new Date(item.ultima_atualizacao).toLocaleDateString(
                          'pt-AO',
                          {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </p>

                      {/* Botões + / - */}
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          className={cn(
                            'flex-1 h-10 rounded-lg transition-colors font-bold text-lg',
                            isEmpty
                              ? 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                              : 'bg-slate-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 text-slate-700 dark:text-slate-300'
                          )}
                          onClick={() => handleDecrement(item)}
                          disabled={isEmpty || isDecrementing}
                          title={`Remover 1 bolsa de ${TIPO_LABEL[item.tipo_sanguineo]}`}
                        >
                          <MdRemove />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="flex-1 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-400 text-slate-700 dark:text-slate-300 transition-colors font-bold text-lg"
                          onClick={() => handleIncrement(item)}
                          disabled={isAdding}
                          title={`Adicionar 1 bolsa de ${TIPO_LABEL[item.tipo_sanguineo]}`}
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
      )}

      {/* Modal — adicionar novo tipo sanguíneo */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white text-lg">
                      Adicionar Tipo Sanguíneo
                    </h2>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Seleccione o tipo para iniciar o inventário com 1 bolsa.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <MdClose />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {missingTypes.map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => handleAdd(tipo)}
                      disabled={isAdding}
                      className="h-14 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black text-base hover:bg-red-600 dark:hover:bg-red-500 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {TIPO_LABEL[tipo]}
                    </button>
                  ))}
                </div>

                {missingTypes.length === 0 && (
                  <p className="text-center text-slate-400 text-sm py-4">
                    Todos os tipos sanguíneos já estão registados.
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Sub-componentes ──────────────────────────────────────────────────────────

interface SummaryCardProps {
  label: string;
  value: number;
  alert?: boolean;
}

const SummaryCard = ({ label, value, alert }: SummaryCardProps) => (
  <div
    className={cn(
      'rounded-xl px-4 py-3 border',
      alert && value > 0
        ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50'
        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
    )}
  >
    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
      {label}
    </p>
    <p
      className={cn(
        'text-2xl font-black mt-0.5 tabular-nums',
        alert && value > 0
          ? 'text-red-600 dark:text-red-400'
          : 'text-slate-900 dark:text-white'
      )}
    >
      {value}
    </p>
  </div>
);
