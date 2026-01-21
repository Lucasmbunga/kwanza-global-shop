import { useParams, useNavigate } from 'react-router-dom';
import { useOrder, useOrderHistory, useUpdateOrder, OrderStatus } from '@/hooks/useOrders';
import { OrderStatusBadge, getStatusOptions } from '@/components/admin/OrderStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  ExternalLink, 
  User, 
  Mail, 
  Phone, 
  Package, 
  DollarSign,
  Clock,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState, useEffect } from 'react';

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(id!);
  const { data: history } = useOrderHistory(id!);
  const updateOrder = useUpdateOrder();

  const [status, setStatus] = useState<OrderStatus>('pending_payment');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setTrackingNumber(order.tracking_number ?? '');
      setNotes(order.notes ?? '');
    }
  }, [order]);

  const handleSave = async () => {
    if (!order) return;
    
    await updateOrder.mutateAsync({
      id: order.id,
      data: {
        status,
        tracking_number: trackingNumber || undefined,
        notes: notes || undefined
      }
    });
  };

  const formatKwanza = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatUSD = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Pedido não encontrado.</p>
        <Button onClick={() => navigate('/admin/orders')}>
          Voltar aos Pedidos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/orders')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-mono">{order.order_number}</h1>
          <p className="text-muted-foreground">
            Criado em {format(new Date(order.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Dados do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" /> Email
                </p>
                <p className="font-medium">{order.customer_email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" /> Telefone
                </p>
                <p className="font-medium">{order.customer_phone || '-'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Product Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Dados do Produto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Produto</p>
                <p className="font-medium">{order.product_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">URL do Produto</p>
                <a 
                  href={order.product_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  {order.product_url.substring(0, 50)}...
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Valores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preço do Produto:</span>
                    <span>{formatUSD(order.product_price_usd)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa de Câmbio:</span>
                    <span>{order.exchange_rate} Kz/USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa de Serviço:</span>
                    <span>{order.service_fee_percentage}%</span>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 flex flex-col justify-center">
                  <p className="text-sm text-muted-foreground mb-1">Total</p>
                  <p className="text-3xl font-bold text-secondary">
                    {formatKwanza(order.total_kwanza)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Histórico
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history && history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((entry) => (
                    <div key={entry.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {entry.old_status && (
                            <>
                              <OrderStatusBadge status={entry.old_status} showIcon={false} />
                              <span className="text-muted-foreground">→</span>
                            </>
                          )}
                          <OrderStatusBadge status={entry.new_status} showIcon={false} />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(new Date(entry.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma alteração de status registrada.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status Atual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <OrderStatusBadge status={order.status} />
              
              <div className="space-y-2">
                <Label>Alterar Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getStatusOptions().map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Número de Rastreamento</Label>
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Ex: BR123456789"
                />
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notas internas sobre o pedido..."
                  rows={4}
                />
              </div>

              <Button 
                className="w-full" 
                onClick={handleSave}
                disabled={updateOrder.isPending}
              >
                {updateOrder.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
