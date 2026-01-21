import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, User, Shield } from 'lucide-react';

export default function Settings() {
  const { profile, hasRole } = useAuth();

  if (!hasRole('admin')) {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Acesso Restrito</h2>
        <p className="text-muted-foreground">
          Apenas administradores podem acessar as configurações.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da plataforma
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Meu Perfil
            </CardTitle>
            <CardDescription>
              Informações da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input value={profile?.full_name ?? ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile?.email ?? ''} disabled />
            </div>
            <p className="text-sm text-muted-foreground">
              Para alterar suas informações, entre em contato com o suporte.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Configurações da Plataforma
            </CardTitle>
            <CardDescription>
              Configurações gerais do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Taxa de Câmbio Padrão (Kz/USD)</Label>
              <Input type="number" defaultValue="850" />
            </div>
            <div className="space-y-2">
              <Label>Taxa de Serviço Padrão (%)</Label>
              <Input type="number" defaultValue="10" />
            </div>
            <Button>Salvar Configurações</Button>
            <p className="text-sm text-muted-foreground">
              Estas configurações serão usadas como padrão ao criar novos pedidos.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
