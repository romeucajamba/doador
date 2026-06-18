import React, { useState } from 'react';
import {
  useProvincias,
  useMunicipios,
  useCreateProvincia,
  useDeleteProvincia,
  useCreateMunicipio,
  useDeleteMunicipio,
} from '@/service/admin/geografia';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { MdDelete, MdAdd } from 'react-icons/md';

export const GeographyManagement = () => {
  const { data: provincias, isLoading: loadingProvincias } = useProvincias();
  const { data: municipios, isLoading: loadingMunicipios } = useMunicipios();

  const createProvincia = useCreateProvincia();
  const deleteProvincia = useDeleteProvincia();

  const createMunicipio = useCreateMunicipio();
  const deleteMunicipio = useDeleteMunicipio();

  const [newProvinciaName, setNewProvinciaName] = useState('');

  const [newMunicipioName, setNewMunicipioName] = useState('');
  const [selectedProvinciaId, setSelectedProvinciaId] = useState<number | ''>(
    ''
  );

  const handleAddProvincia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProvinciaName.trim()) return;
    await createProvincia.mutateAsync({ nome: newProvinciaName });
    setNewProvinciaName('');
  };

  const handleDeleteProvincia = async (id: number) => {
    if (
      confirm(
        'Tem a certeza que deseja apagar esta província? Todos os municípios associados também poderão ser afetados.'
      )
    ) {
      await deleteProvincia.mutateAsync(id);
    }
  };

  const handleAddMunicipio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMunicipioName.trim() || !selectedProvinciaId) return;
    await createMunicipio.mutateAsync({
      nome: newMunicipioName,
      id_provincia: Number(selectedProvinciaId),
    });
    setNewMunicipioName('');
    setSelectedProvinciaId('');
  };

  const handleDeleteMunicipio = async (id: number) => {
    if (confirm('Tem a certeza que deseja apagar este município?')) {
      await deleteMunicipio.mutateAsync(id);
    }
  };

  if (loadingProvincias || loadingMunicipios) {
    return (
      <div className="p-8 text-center font-bold animate-pulse text-slate-500">
        A carregar geografia...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-dark-text dark:text-white tracking-tight">
          Geografia
        </h1>
        <p className="text-neutral-text font-medium text-lg">
          Faça a gestão das províncias e municípios disponíveis no sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PROVÍNCIAS */}
        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl font-black text-primary">
              Províncias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form
              onSubmit={handleAddProvincia}
              className="flex gap-3 items-end"
            >
              <div className="flex-1 space-y-2">
                <Label htmlFor="provinciaName">Nova Província</Label>
                <Input
                  id="provinciaName"
                  value={newProvinciaName}
                  onChange={(e) => setNewProvinciaName(e.target.value)}
                  placeholder="Nome da Província"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={createProvincia.isPending}
                className="gap-2"
              >
                <MdAdd className="text-lg" />
                Adicionar
              </Button>
            </form>

            <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {provincias?.map((p) => (
                    <tr
                      key={p.id_provincia}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-slate-500">
                        #{p.id_provincia}
                      </td>
                      <td className="px-4 py-3 font-bold text-dark-text dark:text-white">
                        {p.nome}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteProvincia(p.id_provincia)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <MdDelete className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {provincias?.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-8 text-center text-slate-500 font-medium"
                      >
                        Nenhuma província registada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* MUNICÍPIOS */}
        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl font-black text-primary">
              Municípios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleAddMunicipio} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provinciaSelect">Província</Label>
                  <select
                    id="provinciaSelect"
                    value={selectedProvinciaId}
                    onChange={(e) =>
                      setSelectedProvinciaId(Number(e.target.value))
                    }
                    required
                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-dark-text font-medium ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="" disabled>
                      Selecione...
                    </option>
                    {provincias?.map((p) => (
                      <option key={p.id_provincia} value={p.id_provincia}>
                        {p.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="municipioName">Novo Município</Label>
                  <Input
                    id="municipioName"
                    value={newMunicipioName}
                    onChange={(e) => setNewMunicipioName(e.target.value)}
                    placeholder="Nome do Município"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={createMunicipio.isPending}
                className="gap-2 w-full"
              >
                <MdAdd className="text-lg" />
                Adicionar Município
              </Button>
            </form>

            <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Província</th>
                    <th className="px-4 py-3">Município</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {municipios?.map((m) => {
                    const prov = provincias?.find(
                      (p) => p.id_provincia === m.id_provincia
                    );
                    return (
                      <tr
                        key={m.id_municipio}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-slate-500">
                          {prov?.nome || `#${m.id_provincia}`}
                        </td>
                        <td className="px-4 py-3 font-bold text-dark-text dark:text-white">
                          {m.nome}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() =>
                              handleDeleteMunicipio(m.id_municipio)
                            }
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <MdDelete className="text-lg" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {municipios?.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-8 text-center text-slate-500 font-medium"
                      >
                        Nenhum município registado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
