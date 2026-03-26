import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MdBusiness,
  MdLocationOn,
  MdLock,
  MdEmail,
  MdPhone,
  MdBadge,
  MdSave,
  MdCloudUpload,
  MdAccountBalance,
} from 'react-icons/md';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/Badge';

export const HospitalProfile = () => {
  const [loading, setLoading] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de atualização
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Perfil da Instituição
        </h1>
        <p className="text-slate-500 text-sm md:text-base">
          Gerencie as informações oficiais do hospital perante o Sistema
          Nacional de Saúde.
        </p>
      </header>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <TabsTrigger value="general" className="rounded-lg px-6">
            Geral
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg px-6">
            Segurança
          </TabsTrigger>
        </TabsList>

        {/* --- DADOS GERAIS --- */}
        <TabsContent value="general">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <form
              onSubmit={handleUpdate}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Foto/Logo do Hospital */}
              <Card className="md:col-span-1 h-fit border-slate-200">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="size-32 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center mb-4 group hover:border-red-400 transition-colors cursor-pointer">
                    <MdCloudUpload className="text-3xl text-slate-400 group-hover:text-red-500" />
                    <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase">
                      Alterar Logotipo
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900">
                    Hospital Geral de Luanda
                  </h3>
                  <Badge className="mt-2 bg-blue-50 text-blue-600 border-blue-100">
                    Unidade Pública
                  </Badge>
                </CardContent>
              </Card>

              {/* Formulário Detalhado */}
              <Card className="md:col-span-2 border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Informações Oficiais
                  </CardTitle>
                  <CardDescription>
                    Dados cadastrados no Ministério da Saúde (MINSA).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MdBusiness /> Nome da Instituição
                      </Label>
                      <Input
                        defaultValue="Hospital Geral de Luanda"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MdBadge /> NIF (Contribuinte)
                      </Label>
                      <Input defaultValue="5417000000" className="rounded-lg" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MdAccountBalance /> Província
                      </Label>
                      <select className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                        <option>Luanda</option>
                        <option>Benguela</option>
                        <option>Huíla</option>
                        <option>Cabinda</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MdLocationOn /> Município
                      </Label>
                      <Input
                        defaultValue="Kilamba Kiaxi"
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MdEmail /> Email Institucional
                      </Label>
                      <Input
                        type="email"
                        defaultValue="secretaria@hgl.gov.ao"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MdPhone /> Contacto Telefônico
                      </Label>
                      <Input
                        defaultValue="+244 923 000 000"
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 rounded-lg min-w-[140px]"
                      disabled={loading}
                    >
                      {loading ? (
                        'A guardar...'
                      ) : (
                        <>
                          <MdSave className="mr-2" /> Guardar Dados
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </motion.div>
        </TabsContent>

        {/* --- SEGURANÇA / SENHA --- */}
        <TabsContent value="security">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="max-w-2xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Alterar Palavra-passe</CardTitle>
                <CardDescription>
                  Certifique-se de usar uma senha forte para proteger os dados
                  dos pacientes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Palavra-passe Atual</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nova Palavra-passe</Label>
                    <Input
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirmar Nova Palavra-passe</Label>
                    <Input
                      type="password"
                      placeholder="Repita a senha"
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <Button className="bg-slate-900 hover:bg-slate-800 rounded-lg">
                    <MdLock className="mr-2" /> Atualizar Credenciais
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
