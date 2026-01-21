import { useState } from 'react';
import { useCreateOrder } from '@/hooks/useOrders';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';

const DEFAULT_EXCHANGE_RATE = 850;
const DEFAULT_FEE_PERCENTAGE = 10;

export function CreateOrderDialog() {
  const [open, setOpen] = useState(false);
  const createOrder = useCreateOrder();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    product_url: '',
    product_name: '',
    product_price_usd: '',
    exchange_rate: DEFAULT_EXCHANGE_RATE.toString(),
    service_fee_percentage: DEFAULT_FEE_PERCENTAGE.toString()
  });

  const calculateTotal = () => {
    const priceUSD = parseFloat(formData.product_price_usd) || 0;
    const rate = parseFloat(formData.exchange_rate) || DEFAULT_EXCHANGE_RATE;
    const feePercent = parseFloat(formData.service_fee_percentage) || DEFAULT_FEE_PERCENTAGE;
    
    const baseKwanza = priceUSD * rate;
    const fee = baseKwanza * (feePercent / 100);
    return baseKwanza + fee;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createOrder.mutateAsync({
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      customer_phone: formData.customer_phone || undefined,
      product_url: formData.product_url,
      product_name: formData.product_name,
      product_price_usd: parseFloat(formData.product_price_usd),
      exchange_rate: parseFloat(formData.exchange_rate),
      service_fee_percentage: parseFloat(formData.service_fee_percentage),
      total_kwanza: calculateTotal()
    });

    setFormData({
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      product_url: '',
      product_name: '',
      product_price_usd: '',
      exchange_rate: DEFAULT_EXCHANGE_RATE.toString(),
      service_fee_percentage: DEFAULT_FEE_PERCENTAGE.toString()
    });
    setOpen(false);
  };

  const formatKwanza = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Pedido</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">Dados do Cliente</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customer_name">Nome Completo *</Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_email">Email *</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, customer_email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="customer_phone">Telefone</Label>
                <Input
                  id="customer_phone"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, customer_phone: e.target.value }))}
                  placeholder="+244 9XX XXX XXX"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">Dados do Produto</h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="product_name">Nome do Produto *</Label>
                <Input
                  id="product_name"
                  value={formData.product_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, product_name: e.target.value }))}
                  placeholder="Ex: iPhone 15 Pro Max 256GB"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product_url">URL do Produto *</Label>
                <Input
                  id="product_url"
                  type="url"
                  value={formData.product_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, product_url: e.target.value }))}
                  placeholder="https://amazon.com/..."
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">Valores</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="product_price_usd">Preço (USD) *</Label>
                <Input
                  id="product_price_usd"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.product_price_usd}
                  onChange={(e) => setFormData(prev => ({ ...prev, product_price_usd: e.target.value }))}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exchange_rate">Taxa de Câmbio (Kz/USD)</Label>
                <Input
                  id="exchange_rate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.exchange_rate}
                  onChange={(e) => setFormData(prev => ({ ...prev, exchange_rate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service_fee_percentage">Taxa de Serviço (%)</Label>
                <Input
                  id="service_fee_percentage"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.service_fee_percentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, service_fee_percentage: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total em Kwanza:</span>
              <span className="text-2xl font-bold text-secondary">
                {formatKwanza(calculateTotal())}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createOrder.isPending}>
              {createOrder.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Criar Pedido
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
