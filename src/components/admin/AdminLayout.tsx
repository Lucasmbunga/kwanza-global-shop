import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLoading, isStaff } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Allow access even if not staff yet (they'll see limited features)
  // In production, you might want to show an "awaiting approval" page

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border flex items-center px-4 bg-card">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">Painel Administrativo</h1>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {!isStaff ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="bg-secondary/10 rounded-full p-6 mb-4">
                  <Loader2 className="h-12 w-12 text-secondary animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Aguardando Aprovação</h2>
                <p className="text-muted-foreground max-w-md">
                  Sua conta foi criada, mas ainda não possui permissões atribuídas.
                  Um administrador precisará aprovar seu acesso.
                </p>
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
