import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Package, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailsDialog } from "@/components/ProductDetailsDialog";
import { useProducts, type Product } from "@/hooks/useProducts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const ProductsPage = () => {
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    if (!products) return [];
    const cats = new Set(products.map((p) => p.category).filter(Boolean) as string[]);
    return Array.from(cats).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setDetailsOpen(true);
  };

  const handleOrder = (product: Product) => {
    const params = new URLSearchParams({
      product_name: product.name,
      product_url: product.image_url || "",
      product_price: product.price_usd.toString(),
    });
    navigate(`/portal/login?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero banner */}
        <section className="bg-[var(--gradient-hero)] text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Nossos Produtos
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Explore todo o nosso catálogo e encontre os melhores produtos internacionais.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-8">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              <ToggleGroup
                type="single"
                value={selectedCategory}
                onValueChange={(v) => v && setSelectedCategory(v)}
                className="flex-wrap"
              >
                <ToggleGroupItem value="all" className="text-xs whitespace-nowrap">
                  Todos
                </ToggleGroupItem>
                {categories.map((cat) => (
                  <ToggleGroupItem
                    key={cat}
                    value={cat}
                    className="text-xs whitespace-nowrap"
                  >
                    {cat}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {filteredProducts.length} produto{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={handleViewDetails}
                    onOrder={handleOrder}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-muted-foreground mb-6">
                Tente alterar os filtros ou o termo de busca.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </section>
      </main>
      <Footer />

      <ProductDetailsDialog
        product={selectedProduct}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onOrder={handleOrder}
      />
    </div>
  );
};

export default ProductsPage;
