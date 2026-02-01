import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCustomerOrder } from '@/hooks/useCustomerOrders';
import { OrderTimeline } from '@/components/customer/OrderTimeline';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Package, 
  ArrowLeft, 
  ExternalLink, 
  MapPin,
  Calendar,
  DollarSign,
  Truck
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { order, isLoading, error } = useCustomerOrder(id || '');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/portal/login');
      }
    };
    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <header className="bg-background border-b">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-8 w-48" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Pedido não encontrado</h2>
            <p className="text-muted-foreground mb-4">
              Este pedido não existe ou você não tem permissão para visualizá-lo.
            </p>
            <Link to="/portal">
              <Button>Voltar ao Portal</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/portal">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-semibold">{order.order_number}</h1>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-sm text-muted-foreground">
                Acompanhe o status do seu pedido em tempo real
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Timeline */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Status do Pedido
                </CardTitle>
                <CardDescription>
                  Atualizações em tempo real sobre a entrega
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrderTimeline currentStatus={order.status} />
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Detalhes do Produto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">{order.product_name}</h3>
                    <a 
                      href={order.product_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      Ver produto original
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {order.tracking_number && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Código de Rastreio</p>
                        <p className="font-mono text-lg bg-muted px-3 py-2 rounded inline-block">
                          {order.tracking_number}
                        </p>
                      </div>
                    </>
                  )}

                  {order.notes && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Observações</p>
                        <p className="text-sm">{order.notes}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Resumo do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Preço do Produto</span>
                  <span className="font-medium">
                    ${order.product_price_usd.toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxa de Câmbio</span>
                  <span className="font-medium">
                    1 USD = {order.exchange_rate} AOA
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxa de Serviço</span>
                  <span className="font-medium">
                    {order.service_fee_percentage}%
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary">
                    {new Intl.NumberFormat('pt-AO', { 
                      style: 'currency', 
                      currency: 'AOA' 
                    }).format(order.total_kwanza)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Datas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Pedido criado em</p>
                  <p className="font-medium">
                    {format(new Date(order.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Última atualização</p>
                  <p className="font-medium">
                    {format(new Date(order.updated_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardContent className="pt-6">
                <Link to="/portal">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar ao Portal
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
