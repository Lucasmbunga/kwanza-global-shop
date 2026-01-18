import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator as CalcIcon, ArrowRight } from "lucide-react";

const Calculator = () => {
  const [productValue, setProductValue] = useState<string>("");
  const [result, setResult] = useState<{
    productKz: number;
    serviceFee: number;
    shipping: number;
    total: number;
  } | null>(null);

  const USD_TO_KZ = 850; // Taxa de exemplo
  const SERVICE_FEE_PERCENT = 0.08; // 8%
  const BASE_SHIPPING = 15000; // Frete base em Kz

  const calculateTotal = () => {
    const usdValue = parseFloat(productValue);
    if (isNaN(usdValue) || usdValue <= 0) return;

    const productKz = usdValue * USD_TO_KZ;
    const serviceFee = productKz * SERVICE_FEE_PERCENT;
    const shipping = BASE_SHIPPING + (usdValue > 100 ? 5000 : 0);
    const total = productKz + serviceFee + shipping;

    setResult({ productKz, serviceFee, shipping, total });
  };

  const formatKz = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section id="calculadora" className="py-24 bg-muted/50 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Estimativa de Custos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Calcule Sua Compra
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra quanto vai pagar pelo seu produto antes de fazer o pedido
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl mx-auto"
        >
          <div className="bg-card rounded-3xl p-8 shadow-elevated border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center">
                <CalcIcon className="w-6 h-6 text-navy-dark" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Calculadora de Preços</h3>
                <p className="text-sm text-muted-foreground">Valores estimados em Kwanza</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Valor do Produto (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                  <input
                    type="number"
                    value={productValue}
                    onChange={(e) => setProductValue(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-4 rounded-xl border border-input bg-background text-foreground text-lg font-medium focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                  />
                </div>
              </div>

              <Button
                variant="hero"
                size="xl"
                className="w-full"
                onClick={calculateTotal}
              >
                Calcular Total
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            {result && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 pt-6 border-t border-border"
              >
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valor do Produto</span>
                    <span className="font-medium text-foreground">{formatKz(result.productKz)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxa de Serviço (8%)</span>
                    <span className="font-medium text-foreground">{formatKz(result.serviceFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete Estimado</span>
                    <span className="font-medium text-foreground">{formatKz(result.shipping)}</span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between">
                    <span className="font-semibold text-foreground">Total Estimado</span>
                    <span className="text-xl font-bold text-gold">{formatKz(result.total)}</span>
                  </div>
                </div>
                
                <p className="mt-4 text-xs text-muted-foreground text-center">
                  * Valores estimados. O preço final pode variar conforme peso e dimensões do produto.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Calculator;
