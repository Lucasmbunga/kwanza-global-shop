import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Loader2, UserPlus, Trash2, Shield, ShieldCheck, Wallet, Mail } from 'lucide-react';

type AppRole = 'admin' | 'operator' | 'financial';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
}

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}

const roleConfig: Record<AppRole, { label: string; icon: typeof Shield; className: string }> = {
  admin: { label: 'Administrador', icon: ShieldCheck, className: 'bg-primary text-primary-foreground' },
  operator: { label: 'Operador', icon: Shield, className: 'bg-blue-500 text-white' },
  financial: { label: 'Financeiro', icon: Wallet, className: 'bg-green-500 text-white' }
};

export default function Team() {
  const { hasRole, user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('operator');
  
  // Invite user state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<AppRole>('operator');
  const [isInviting, setIsInviting] = useState(false);

  // Fetch all profiles
  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');
      if (error) throw error;
      return data as Profile[];
    }
  });

  // Fetch all roles
  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ['user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');
      if (error) throw error;
      return data as UserRole[];
    }
  });

  // Add role mutation
  const addRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      toast.success('Função atribuída com sucesso!');
      setSelectedUserId('');
    },
    onError: (error) => {
      toast.error('Erro ao atribuir função: ' + error.message);
    }
  });

  // Remove role mutation
  const removeRole = useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      toast.success('Função removida com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao remover função: ' + error.message);
    }
  });

  const getUserRoles = (userId: string) => {
    return roles?.filter(r => r.user_id === userId) ?? [];
  };

  const getAvailableUsers = () => {
    // Users without any role
    return profiles?.filter(p => {
      const userRoles = getUserRoles(p.user_id);
      return userRoles.length === 0;
    }) ?? [];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleInviteUser = async () => {
    if (!inviteEmail || !inviteName) {
      toast.error('Preencha o email e nome do usuário');
      return;
    }

    setIsInviting(true);
    
    try {
      // Create user account with a temporary password
      const tempPassword = crypto.randomUUID();
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: inviteEmail,
        password: tempPassword,
        options: {
          emailRedirectTo: window.location.origin + '/admin/login',
          data: { full_name: inviteName }
        }
      });

      if (signUpError) throw signUpError;

      if (signUpData.user) {
        // Create profile
        const { error: profileError } = await supabase.from('profiles').insert({
          user_id: signUpData.user.id,
          full_name: inviteName,
          email: inviteEmail
        });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        // Assign role
        const { error: roleError } = await supabase.from('user_roles').insert({
          user_id: signUpData.user.id,
          role: inviteRole
        });

        if (roleError) {
          console.error('Role assignment error:', roleError);
        }

        // Send password reset email so user can set their own password
        await supabase.auth.resetPasswordForEmail(inviteEmail, {
          redirectTo: window.location.origin + '/admin/reset-password',
        });

        queryClient.invalidateQueries({ queryKey: ['profiles'] });
        queryClient.invalidateQueries({ queryKey: ['user-roles'] });
        
        toast.success(`Convite enviado para ${inviteEmail}! O usuário receberá um email para definir sua senha.`);
        setInviteEmail('');
        setInviteName('');
        setInviteRole('operator');
      }
    } catch (error: any) {
      toast.error('Erro ao convidar usuário: ' + error.message);
    }
    
    setIsInviting(false);
  };

  if (!hasRole('admin')) {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Acesso Restrito</h2>
        <p className="text-muted-foreground">
          Apenas administradores podem gerenciar a equipe.
        </p>
      </div>
    );
  }

  const isLoading = profilesLoading || rolesLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Equipe</h1>
        <p className="text-muted-foreground">
          Gerencie os membros da equipe e suas funções
        </p>
      </div>

      {/* Invite New User Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Convidar Novo Usuário
          </CardTitle>
          <CardDescription>
            Envie um convite por email para adicionar um novo membro à equipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="invite-name">Nome Completo</Label>
              <Input
                id="invite-name"
                placeholder="Nome do usuário"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="email@exemplo.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Função</Label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as AppRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="operator">Operador</SelectItem>
                  <SelectItem value="financial">Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleInviteUser}
                disabled={isInviting || !inviteEmail || !inviteName}
                className="w-full"
              >
                {isInviting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Mail className="h-4 w-4 mr-2" />
                Enviar Convite
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Role Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Atribuir Função
          </CardTitle>
          <CardDescription>
            Selecione um usuário sem função e atribua uma permissão
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label>Usuário</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableUsers().length > 0 ? (
                    getAvailableUsers().map(profile => (
                      <SelectItem key={profile.user_id} value={profile.user_id}>
                        {profile.full_name} ({profile.email})
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                      Nenhum usuário sem função
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Função</Label>
              <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="operator">Operador</SelectItem>
                  <SelectItem value="financial">Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => addRole.mutate({ userId: selectedUserId, role: selectedRole })}
                disabled={!selectedUserId || addRole.isPending}
              >
                {addRole.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Atribuir
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Membros da Equipe</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : profiles && profiles.filter(p => getUserRoles(p.user_id).length > 0).length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membro</TableHead>
                  <TableHead>Funções</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles
                  .filter(p => getUserRoles(p.user_id).length > 0)
                  .map((profile) => {
                    const userRoles = getUserRoles(profile.user_id);
                    return (
                      <TableRow key={profile.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={profile.avatar_url ?? undefined} />
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {getInitials(profile.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{profile.full_name}</p>
                              <p className="text-sm text-muted-foreground">{profile.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {userRoles.map((role) => {
                              const config = roleConfig[role.role];
                              const Icon = config.icon;
                              return (
                                <Badge key={role.id} className={config.className}>
                                  <Icon className="h-3 w-3 mr-1" />
                                  {config.label}
                                </Badge>
                              );
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {profile.user_id !== user?.id && userRoles.map((role) => (
                            <Button
                              key={role.id}
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRole.mutate(role.id)}
                              disabled={removeRole.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          ))}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhum membro da equipe com funções atribuídas.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Pending Users */}
      {getAvailableUsers().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Aguardando Aprovação</CardTitle>
            <CardDescription>
              Usuários que se registraram mas ainda não têm funções atribuídas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getAvailableUsers().map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-muted">
                            {getInitials(profile.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{profile.full_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {profile.email}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
