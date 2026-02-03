import { Package } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { Product } from "@/hooks/useProducts";

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onOrder: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails, onOrder }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <Card className="overflow-hidden group hover:shadow-elevated transition-all duration-300">
      <div className="relative overflow-hidden">
        <AspectRatio ratio={4 / 3}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </AspectRatio>
        {product.category && (
          <span className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full">
            {product.category}
          </span>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1 mb-1">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>
        )}
        <p className="text-xl font-bold text-primary">
          {formatPrice(product.price_usd)}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onViewDetails(product)}
        >
          Ver Detalhes
        </Button>
        <Button
          variant="hero"
          size="sm"
          className="flex-1"
          onClick={() => onOrder(product)}
        >
          Encomendar
        </Button>
      </CardFooter>
    </Card>
  );
}
