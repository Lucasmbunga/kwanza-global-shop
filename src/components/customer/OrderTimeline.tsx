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
import { cn } from '@/lib/utils';

const statusFlow: OrderStatus[] = [
  'pending_payment',
  'payment_confirmed',
  'purchasing',
  'shipped_international',
  'in_customs',
  'shipped_local',
  'delivered'
];

const statusConfig: Record<OrderStatus, { label: string; icon: typeof Clock; color: string }> = {
  pending_payment: {
    label: 'Aguardando Pagamento',
    icon: Clock,
    color: 'text-amber-500'
  },
  payment_confirmed: {
    label: 'Pagamento Confirmado',
    icon: CreditCard,
    color: 'text-green-500'
  },
  purchasing: {
    label: 'Comprando Produto',
    icon: ShoppingBag,
    color: 'text-blue-500'
  },
  shipped_international: {
    label: 'Enviado (Internacional)',
    icon: Plane,
    color: 'text-indigo-500'
  },
  in_customs: {
    label: 'Na Alfândega',
    icon: Building2,
    color: 'text-purple-500'
  },
  shipped_local: {
    label: 'Em Trânsito (Angola)',
    icon: Truck,
    color: 'text-cyan-500'
  },
  delivered: {
    label: 'Entregue',
    icon: CheckCircle,
    color: 'text-green-600'
  },
  cancelled: {
    label: 'Cancelado',
    icon: XCircle,
    color: 'text-destructive'
  }
};

interface OrderTimelineProps {
  currentStatus: OrderStatus;
}

export function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  if (currentStatus === 'cancelled') {
    return (
      <div className="flex items-center justify-center p-8 bg-destructive/10 rounded-lg">
        <XCircle className="h-8 w-8 text-destructive mr-3" />
        <span className="text-lg font-medium text-destructive">Pedido Cancelado</span>
      </div>
    );
  }

  const currentIndex = statusFlow.indexOf(currentStatus);

  return (
    <div className="space-y-4">
      {statusFlow.map((status, index) => {
        const config = statusConfig[status];
        const Icon = config.icon;
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;

        return (
          <div key={status} className="flex items-start gap-4">
            <div className="relative flex flex-col items-center">
              <div 
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all",
                  isCompleted && "bg-primary border-primary",
                  isCurrent && "bg-primary/10 border-primary animate-pulse",
                  isPending && "bg-muted border-muted-foreground/30"
                )}
              >
                <Icon 
                  className={cn(
                    "h-5 w-5",
                    isCompleted && "text-primary-foreground",
                    isCurrent && config.color,
                    isPending && "text-muted-foreground/50"
                  )} 
                />
              </div>
              {index < statusFlow.length - 1 && (
                <div 
                  className={cn(
                    "w-0.5 h-8 mt-1",
                    isCompleted ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />
              )}
            </div>
            <div className={cn(
              "pt-2",
              isPending && "opacity-50"
            )}>
              <p className={cn(
                "font-medium",
                isCurrent && config.color
              )}>
                {config.label}
              </p>
              {isCurrent && (
                <p className="text-sm text-muted-foreground mt-1">
                  Status atual do seu pedido
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
