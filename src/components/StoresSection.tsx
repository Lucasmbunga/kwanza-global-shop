import { motion } from "framer-motion";

const stores = [
  { name: "Amazon", logo: "🛒" },
  { name: "eBay", logo: "🏷️" },
  { name: "AliExpress", logo: "🎁" },
  { name: "Nike", logo: "👟" },
  { name: "Apple", logo: "🍎" },
  { name: "Zara", logo: "👔" },
  { name: "Samsung", logo: "📱" },
  { name: "Shein", logo: "👗" },
];

const StoresSection = () => {
  return (
    <section id="lojas" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Lojas Parceiras
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Compre de Qualquer Lugar
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Acesse milhares de lojas internacionais e traga seus produtos favoritos para Angola
          </p>
        </motion.div>

        {/* Store Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12"
        >
          {stores.map((store, index) => (
            <motion.div
              key={store.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex flex-col items-center justify-center p-6 bg-card rounded-2xl border border-border hover:border-gold/30 hover:shadow-soft transition-all duration-300 group"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{store.logo}</span>
              <span className="font-medium text-foreground">{store.name}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground"
        >
          E mais de <span className="text-gold font-semibold">500+ lojas</span> disponíveis para você explorar
        </motion.p>
      </div>
    </section>
  );
};

export default StoresSection;
