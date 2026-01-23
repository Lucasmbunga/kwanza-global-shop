import { useMemo } from 'react';
import { useOrders, useOrderStats, OrderStatus } from '@/hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Package,
  Users,
  Activity,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { subDays, startOfDay, eachDayOfInterval } from 'date-fns';

export default function Dashboard() {
  const { data: stats, isLoading: isLoadingStats } = useOrderStats();
  const { data: orders, isLoading: isLoadingOrders } = useOrders();

  const formatKwanza = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Get recent orders (last 5)
  const recentOrders = useMemo(() => {
    if (!orders) return [];
    return orders.slice(0, 5);
  }, [orders]);

  // Get orders requiring attention (pending payment or in customs)
  const attentionOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter(o => 
      o.status === 'pending_payment' || 
      o.status === 'in_customs'
    ).slice(0, 3);
  }, [orders]);

  // Orders trend data (last 7 days)
  const trendData = useMemo(() => {
    if (!orders) return [];

    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date()
    });

    return last7Days.map(day => {
      const dayStart = startOfDay(day);
      const dayOrders = orders.filter(o => {
        const orderDate = startOfDay(new Date(o.created_at));
        return orderDate.getTime() === dayStart.getTime();
      });

      return {
        date: format(day, 'dd/MM', { locale: ptBR }),
        pedidos: dayOrders.length,
        receita: dayOrders
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, o) => sum + Number(o.total_kwanza), 0)
      };
    });
  }, [orders]);

  const chartConfig = {
    pedidos: {
      label: 'Pedidos',
      color: 'hsl(var(--primary))'
    },
    receita: {
      label: 'Receita',
      color: 'hsl(var(--secondary))'
    }
  };

  const statCards = [
    {
      title: 'Total de Pedidos',
      value: stats?.total ?? 0,
      icon: ShoppingCart,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: '+12%'
    },
    {
      title: 'Pendentes',
      value: stats?.pending ?? 0,
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
    {
      title: 'Em Processo',
      value: stats?.inProgress ?? 0,
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Entregues',
      value: stats?.delivered ?? 0,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Cancelados',
      value: stats?.cancelled ?? 0,
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10'
    },
    {
      title: 'Receita Total',
      value: formatKwanza(stats?.totalRevenue ?? 0),
      icon: DollarSign,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      isRevenue: true
    }
  ];

  const quickActions = [
    { label: 'Novo Pedido', icon: Plus, href: '/admin/orders', variant: 'default' as const },
    { label: 'Ver Relatórios', icon: TrendingUp, href: '/admin/reports', variant: 'outline' as const },
    { label: 'Gerenciar Equipe', icon: Users, href: '/admin/team', variant: 'outline' as const },
  ];

  const isLoading = isLoadingStats || isLoadingOrders;

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das atividades da plataforma
          </p>
        </div>
        <div className="flex gap-2">
          {quickActions.map((action) => (
            <Button key={action.label} variant={action.variant} asChild>
              <Link to={action.href}>
                <action.icon className="h-4 w-4 mr-2" />
                {action.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="flex items-end gap-2">
                  <p className={`text-2xl font-bold ${stat.isRevenue ? stat.color : ''}`}>
                    {stat.value}
                  </p>
                  {stat.trend && (
                    <span className="text-xs text-primary mb-1">{stat.trend}</span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Orders Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trend Chart - Takes 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tendência de Pedidos</CardTitle>
                <CardDescription>Últimos 7 dias</CardDescription>
              </div>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : trendData.length > 0 && trendData.some(d => d.pedidos > 0) ? (
              <ChartContainer config={chartConfig} className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorPedidos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="pedidos" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorPedidos)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[250px] flex flex-col items-center justify-center text-muted-foreground">
                <Calendar className="h-12 w-12 mb-3 text-muted-foreground/50" />
                <p>Nenhum pedido nos últimos 7 dias</p>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link to="/admin/orders">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar primeiro pedido
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attention Required */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Atenção Necessária</CardTitle>
                <CardDescription>Pedidos que precisam de ação</CardDescription>
              </div>
              <AlertCircle className="h-5 w-5 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : attentionOrders.length > 0 ? (
              <div className="space-y-3">
                {attentionOrders.map((order) => (
                  <Link 
                    key={order.id} 
                    to={`/admin/orders/${order.id}`}
                    className="block p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{order.order_number}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {order.customer_name}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground">
                <CheckCircle className="h-12 w-12 mb-3 text-primary opacity-50" />
                <p className="text-sm">Tudo em dia!</p>
                <p className="text-xs">Nenhum pedido requer atenção</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pedidos Recentes</CardTitle>
              <CardDescription>Últimos pedidos criados na plataforma</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/orders">
                Ver todos
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Link 
                  key={order.id}
                  to={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{order.order_number}</span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.customer_name} • {order.product_name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-secondary">
                      {formatKwanza(order.total_kwanza)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(order.created_at), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="mb-2">Nenhum pedido ainda</p>
              <p className="text-sm mb-4">Crie o primeiro pedido para começar a acompanhar</p>
              <Button asChild>
                <Link to="/admin/orders">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Pedido
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
