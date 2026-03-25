import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Donor } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { 
  MdPerson, 
  MdEmail, 
  MdPhone, 
  MdLocationOn, 
  MdBloodtype, 
  MdCameraAlt,
  MdLock,
  MdCheckCircle,
  MdEdit
} from 'react-icons/md';
import { cn } from '@/lib/utils';

export const Profile = () => {
  const { user } = useAuthStore();
  const donor = user as Donor;
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: donor?.name || 'Usuário',
    email: donor?.email || 'usuario@example.com',
    phone: donor?.phone || '9XX XXX XXX',
    location: 'Luanda, Angola', // Mock location
    bloodType: donor?.bloodType || 'O+',
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-dark-text dark:text-white tracking-tight">Meu Perfil</h1>
          <p className="text-neutral-text font-bold mt-1 uppercase tracking-widest text-xs">Gerencie suas informações e segurança</p>
        </div>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
          className="h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-xs gap-2"
        >
          {isEditing ? 'Cancelar Alterações' : <><MdEdit className="text-lg" /> Editar Perfil</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Stats */}
        <div className="space-y-8">
          <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="relative group cursor-pointer lg:mb-6">
                <div className="size-32 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary font-black text-5xl shadow-inner border-4 border-white dark:border-slate-800 overflow-hidden">
                  {donor?.name?.charAt(0) || 'U'}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-[2rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <MdCameraAlt className="text-3xl text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 size-10 bg-success rounded-xl border-4 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-lg">
                  <MdCheckCircle className="text-xl" />
                </div>
              </div>
              
              <h2 className="text-2xl font-black text-dark-text dark:text-white mt-4">{formData.name}</h2>
              <p className="text-neutral-text font-bold text-xs uppercase tracking-widest mb-6">Doador Ativo</p>
              
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-gray-50 dark:border-gray-800">
                  <p className="text-[10px] font-black text-neutral-text uppercase tracking-tighter mb-1">Tipo Sanguíneo</p>
                  <p className="text-xl font-black text-primary">{formData.bloodType}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-gray-50 dark:border-gray-800">
                  <p className="text-[10px] font-black text-neutral-text uppercase tracking-tighter mb-1">Donativos</p>
                  <p className="text-xl font-black text-dark-text dark:text-white">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-primary text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <MdBloodtype className="text-9xl rotate-12" />
            </div>
            <CardContent className="p-8 relative z-10">
              <h3 className="text-xl font-black uppercase tracking-widest mb-2">Herói Local</h3>
              <p className="text-white/80 font-bold text-sm leading-relaxed mb-6">
                Você já ajudou a salvar aproximadamente 36 vidas com seus donativos regulares.
              </p>
              <Button variant="outline" className="w-full h-12 rounded-xl bg-white/20 border-white/30 text-white hover:bg-white hover:text-primary transition-all font-black uppercase tracking-widest text-xs">
                Ver Certificados
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Information & Settings */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-xl font-black flex items-center gap-3 text-dark-text dark:text-white">
                <MdPerson className="text-primary text-2xl" /> Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-neutral-text uppercase tracking-widest ml-1">Nome Completo</Label>
                  <div className="relative">
                    <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-neutral-text" />
                    <Input 
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="pl-12 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border-none font-bold text-dark-text dark:text-white focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-neutral-text uppercase tracking-widest ml-1">E-mail</Label>
                  <div className="relative">
                    <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-neutral-text" />
                    <Input 
                      disabled={!isEditing}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="pl-12 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border-none font-bold text-dark-text dark:text-white focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-neutral-text uppercase tracking-widest ml-1">Telefone</Label>
                  <div className="relative">
                    <MdPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-neutral-text" />
                    <Input 
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="pl-12 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border-none font-bold text-dark-text dark:text-white focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-neutral-text uppercase tracking-widest ml-1">Localização</Label>
                  <div className="relative">
                    <MdLocationOn className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-neutral-text" />
                    <Input 
                      disabled={!isEditing}
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="pl-12 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border-none font-bold text-dark-text dark:text-white focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs"
                  >
                    {isSaving ? 'A guardar...' : 'Guardar Alterações'}
                  </Button>
                </div>
              )}

              {saveSuccess && (
                <div className="flex items-center gap-3 p-4 bg-success/10 text-success rounded-2xl font-bold animate-in zoom-in duration-300">
                  <MdCheckCircle className="text-2xl" />
                  Perfil atualizado com sucesso!
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-xl font-black flex items-center gap-3 text-dark-text dark:text-white">
                <MdLock className="text-primary text-2xl" /> Segurança da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-neutral-text uppercase tracking-widest ml-1">Alterar Senha</Label>
                  <Input 
                    type="password"
                    placeholder="Senha atual"
                    className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border-none font-bold text-dark-text dark:text-white focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    type="password"
                    placeholder="Nova senha"
                    className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border-none font-bold text-dark-text dark:text-white focus:ring-2 focus:ring-primary/20"
                  />
                  <Input 
                    type="password"
                    placeholder="Confirmar nova senha"
                    className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border-none font-bold text-dark-text dark:text-white focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <Button variant="outline" className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs border-primary/20 text-primary hover:bg-primary/5">
                Atualizar Senha
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
