import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeCustomerOrders } from '@/hooks/useCustomerOrders';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Package, 
  LogOut, 
  ExternalLink, 
  Clock, 
  Truck, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CustomerPortal() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { orders, isLoading: ordersLoading } = useRealtimeCustomerOrders();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/portal/login');
        return;
      }
      setUser(user);
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/portal/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activeOrders = orders.filter(o => 
    !['delivered', 'cancelled'].includes(o.status)
  );
  const completedOrders = orders.filter(o => o.status === 'delivered');

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold">Portal do Cliente</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm">
                Voltar ao Site
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeOrders.length}</p>
                  <p className="text-sm text-muted-foreground">Pedidos em Andamento</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedOrders.length}</p>
                  <p className="text-sm text-muted-foreground">Pedidos Entregues</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{orders.length}</p>
                  <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pedidos em Andamento
            </h2>
            <div className="grid gap-4">
              {activeOrders.map(order => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                            {order.order_number}
                          </span>
                          <OrderStatusBadge status={order.status} />
                        </div>
                        <h3 className="font-medium">{order.product_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Pedido em {format(new Date(order.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                        {order.tracking_number && (
                          <p className="text-sm mt-1">
                            <span className="text-muted-foreground">Rastreio:</span>{' '}
                            <span className="font-mono">{order.tracking_number}</span>
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="font-semibold">
                            {new Intl.NumberFormat('pt-AO', { 
                              style: 'currency', 
                              currency: 'AOA' 
                            }).format(order.total_kwanza)}
                          </p>
                        </div>
                        <Link to={`/portal/pedido/${order.id}`}>
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Order History */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Package className="h-5 w-5" />
            Histórico de Pedidos
          </h2>
          
          {ordersLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Nenhum pedido encontrado</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Você ainda não fez nenhum pedido ou seus pedidos estão associados a outro email.
                  </p>
                  <Link to="/">
                    <Button>Fazer um Pedido</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {orders.map(order => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                            {order.order_number}
                          </span>
                          <OrderStatusBadge status={order.status} />
                        </div>
                        <h3 className="font-medium">{order.product_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="font-semibold">
                            {new Intl.NumberFormat('pt-AO', { 
                              style: 'currency', 
                              currency: 'AOA' 
                            }).format(order.total_kwanza)}
                          </p>
                        </div>
                        <Link to={`/portal/pedido/${order.id}`}>
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
