import { useMemo } from 'react';
import { useOrders, OrderStatus } from '@/hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { format, subDays, startOfDay, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusLabels: Record<OrderStatus, string> = {
  pending_payment: 'Aguardando Pagamento',
  payment_confirmed: 'Pagamento Confirmado',
  purchasing: 'Comprando',
  shipped_international: 'Enviado (Int.)',
  in_customs: 'Na Alfândega',
  shipped_local: 'Enviado (Local)',
  delivered: 'Entregue',
  cancelled: 'Cancelado'
};

const statusColors: Record<OrderStatus, string> = {
  pending_payment: '#f59e0b',
  payment_confirmed: '#10b981',
  purchasing: '#3b82f6',
  shipped_international: '#6366f1',
  in_customs: '#8b5cf6',
  shipped_local: '#06b6d4',
  delivered: '#22c55e',
  cancelled: '#ef4444'
};

export default function Reports() {
  const { data: orders, isLoading } = useOrders();

  const formatKwanza = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Orders by day (last 7 days)
  const ordersByDay = useMemo(() => {
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
          .reduce((sum, o) => sum + o.total_kwanza, 0)
      };
    });
  }, [orders]);

  // Orders by status
  const ordersByStatus = useMemo(() => {
    if (!orders) return [];

    const statusCount = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<OrderStatus, number>);

    return Object.entries(statusCount).map(([status, count]) => ({
      name: statusLabels[status as OrderStatus],
      value: count,
      color: statusColors[status as OrderStatus]
    }));
  }, [orders]);

  // Summary stats
  const stats = useMemo(() => {
    if (!orders) return null;

    const activeOrders = orders.filter(o => o.status !== 'cancelled');
    const totalRevenue = activeOrders.reduce((sum, o) => sum + o.total_kwanza, 0);
    const avgOrderValue = activeOrders.length > 0 ? totalRevenue / activeOrders.length : 0;
    
    const today = startOfDay(new Date());
    const todayOrders = orders.filter(o => 
      startOfDay(new Date(o.created_at)).getTime() === today.getTime()
    );

    return {
      totalOrders: orders.length,
      totalRevenue,
      avgOrderValue,
      todayOrders: todayOrders.length,
      deliveredRate: orders.length > 0 
        ? (orders.filter(o => o.status === 'delivered').length / orders.length * 100).toFixed(1)
        : 0
    };
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">
          Análise de desempenho da plataforma
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.totalOrders ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-secondary">
              {formatKwanza(stats?.totalRevenue ?? 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ticket Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatKwanza(stats?.avgOrderValue ?? 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">
              {stats?.deliveredRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orders by Day */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos nos Últimos 7 Dias</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersByDay.length > 0 && ordersByDay.some(d => d.pedidos > 0) ? (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ordersByDay}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="pedidos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum pedido nos últimos 7 dias
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos por Status</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersByStatus.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ordersByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {ordersByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string) => [value, name]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum pedido para exibir
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
