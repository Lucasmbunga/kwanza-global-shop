import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, ShieldCheck, Truck } from "lucide-react";
import heroImage from "@/assets/hero-global-shopping.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Global Shopping"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy-dark/90 to-navy-dark/70" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-20 h-20 bg-gold/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 left-1/3 w-32 h-32 bg-gold/5 rounded-full blur-2xl"
        />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold mb-6"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">Compras Internacionais em Kwanza</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
            >
              O Mundo Inteiro
              <span className="block text-gold">Na Palma da Sua Mão</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl"
            >
              Compre em qualquer loja internacional, pague em Kwanza. 
              Nós cuidamos da importação, alfândega e entrega até à sua porta.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button variant="hero" size="xl" className="group">
                Começar a Comprar
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="heroOutline" size="xl">
                Ver Como Funciona
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-6"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="w-5 h-5 text-gold" />
                <span className="text-sm">Pagamento Seguro</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Truck className="w-5 h-5 text-gold" />
                <span className="text-sm">Entrega em Todo Angola</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="w-5 h-5 text-gold" />
                <span className="text-sm">+500 Lojas Internacionais</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gold/20 rounded-3xl blur-3xl" />
              <div className="relative bg-card/10 backdrop-blur-lg border border-gold/20 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <StatCard value="10.000+" label="Clientes Satisfeitos" />
                  <StatCard value="25.000+" label="Encomendas Entregues" />
                  <StatCard value="48h" label="Processamento Médio" />
                  <StatCard value="5%" label="Taxa Mínima" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-gold/50 flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
};

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center p-4 rounded-xl bg-navy/50 border border-gold/10">
    <p className="text-2xl md:text-3xl font-bold text-gold mb-1">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

export default HeroSection;
