import { Package, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/hooks/useProducts";

interface ProductDetailsDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrder: (product: Product) => void;
}

export function ProductDetailsDialog({
  product,
  open,
  onOpenChange,
  onOrder,
}: ProductDetailsDialogProps) {
  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Estimativa em Kwanzas (usando taxa aproximada)
  const estimatedKwanza = product.price_usd * 850 * 1.1; // 10% taxa de serviço

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden">
            <AspectRatio ratio={16 / 9}>
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Package className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </AspectRatio>
          </div>

          {product.category && (
            <span className="inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
              {product.category}
            </span>
          )}

          {product.description && (
            <p className="text-muted-foreground">{product.description}</p>
          )}

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Preço (USD)</span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.price_usd)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Estimativa (AOA)</span>
              <span className="text-lg font-semibold">
                {new Intl.NumberFormat("pt-AO", {
                  style: "currency",
                  currency: "AOA",
                  maximumFractionDigits: 0,
                }).format(estimatedKwanza)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              * Valor estimado incluindo taxa de serviço. O valor final pode variar conforme a taxa de câmbio no momento da compra.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Fechar
            </Button>
            <Button
              variant="hero"
              className="flex-1"
              onClick={() => {
                onOrder(product);
                onOpenChange(false);
              }}
            >
              Encomendar Agora
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
