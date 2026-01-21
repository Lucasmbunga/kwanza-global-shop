import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/hooks/useOrders';
import { 
  Clock, 
  CreditCard, 
  ShoppingBag, 
  Plane, 
  Building2, 
  Truck, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';

const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof Clock; className: string }> = {
  pending_payment: {
    label: 'Aguardando Pagamento',
    variant: 'outline',
    icon: Clock,
    className: 'border-amber-500 text-amber-500 bg-amber-500/10'
  },
  payment_confirmed: {
    label: 'Pagamento Confirmado',
    variant: 'secondary',
    icon: CreditCard,
    className: 'border-green-500 text-green-500 bg-green-500/10'
  },
  purchasing: {
    label: 'Comprando',
    variant: 'secondary',
    icon: ShoppingBag,
    className: 'border-blue-500 text-blue-500 bg-blue-500/10'
  },
  shipped_international: {
    label: 'Enviado (Internacional)',
    variant: 'secondary',
    icon: Plane,
    className: 'border-indigo-500 text-indigo-500 bg-indigo-500/10'
  },
  in_customs: {
    label: 'Na Alfândega',
    variant: 'secondary',
    icon: Building2,
    className: 'border-purple-500 text-purple-500 bg-purple-500/10'
  },
  shipped_local: {
    label: 'Enviado (Local)',
    variant: 'secondary',
    icon: Truck,
    className: 'border-cyan-500 text-cyan-500 bg-cyan-500/10'
  },
  delivered: {
    label: 'Entregue',
    variant: 'default',
    icon: CheckCircle,
    className: 'bg-green-500 text-white border-green-500'
  },
  cancelled: {
    label: 'Cancelado',
    variant: 'destructive',
    icon: XCircle,
    className: ''
  }
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
  showIcon?: boolean;
}

export function OrderStatusBadge({ status, showIcon = true }: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`gap-1 ${config.className}`}>
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}

export function getStatusOptions() {
  return Object.entries(statusConfig).map(([value, config]) => ({
    value: value as OrderStatus,
    label: config.label
  }));
}
