import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailsDialog } from "@/components/ProductDetailsDialog";
import { useProducts, type Product } from "@/hooks/useProducts";

export function ProductsSection() {
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setDetailsOpen(true);
  };

  const handleOrder = (product: Product) => {
    // Redireciona para o portal do cliente com os dados do produto
    const params = new URLSearchParams({
      product_name: product.name,
      product_url: product.image_url || "",
      product_price: product.price_usd.toString(),
    });
    navigate(`/portal/login?${params.toString()}`);
  };

  // Mostra apenas os primeiros 6 produtos
  const displayedProducts = products?.slice(0, 6) || [];

  return (
    <section id="produtos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Produtos Disponíveis
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Confira alguns dos produtos que podemos trazer para você. 
            Escolha o que precisa e faça sua encomenda diretamente.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : displayedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleViewDetails}
                  onOrder={handleOrder}
                />
              ))}
            </div>

            {products && products.length > 6 && (
              <div className="text-center">
              <Button variant="outline" size="lg" className="group" onClick={() => navigate("/produtos")}>
                  Ver Todos os Produtos
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Nenhum produto disponível no momento
            </h3>
            <p className="text-muted-foreground mb-6">
              Novos produtos serão adicionados em breve. Enquanto isso, você pode 
              solicitar qualquer produto através do nosso portal.
            </p>
            <Button variant="hero" onClick={() => navigate("/portal/login")}>
              Fazer Pedido Personalizado
            </Button>
          </div>
        )}
      </div>

      <ProductDetailsDialog
        product={selectedProduct}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onOrder={handleOrder}
      />
    </section>
  );
}
