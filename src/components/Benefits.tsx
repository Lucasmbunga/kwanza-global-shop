import { motion } from "framer-motion";
import { Shield, Clock, Headphones, Wallet, Globe2, Truck } from "lucide-react";

const benefits = [
  {
    icon: Wallet,
    title: "Pague em Kwanza",
    description: "Esqueça a dor de cabeça com câmbio. Pague tudo em moeda local com taxas transparentes."
  },
  {
    icon: Shield,
    title: "Compra Garantida",
    description: "Se algo der errado, devolvemos seu dinheiro. Sua compra é 100% protegida."
  },
  {
    icon: Clock,
    title: "Entrega Rápida",
    description: "Processamento em até 48h e entrega expressa para todas as províncias de Angola."
  },
  {
    icon: Globe2,
    title: "Lojas Ilimitadas",
    description: "Amazon, eBay, AliExpress, Nike, Apple e mais de 500 lojas disponíveis."
  },
  {
    icon: Headphones,
    title: "Suporte 24/7",
    description: "Equipe dedicada pronta para ajudar a qualquer momento via WhatsApp ou chat."
  },
  {
    icon: Truck,
    title: "Rastreio Completo",
    description: "Acompanhe sua encomenda em tempo real, desde a compra até a entrega."
  }
];

const Benefits = () => {
  return (
    <section id="beneficios" className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-gold/20 text-gold text-sm font-medium mb-4">
            Por Que Escolher-nos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            Benefícios Exclusivos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Oferecemos a melhor experiência de compras internacionais para angolanos
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <BenefitCard {...benefit} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BenefitCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
}) => (
  <div className="group relative bg-card/10 backdrop-blur-lg rounded-2xl p-6 border border-gold/10 hover:border-gold/30 transition-all duration-300 hover:-translate-y-1">
    <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center mb-4 group-hover:bg-gold/30 transition-colors">
      <Icon className="w-6 h-6 text-gold" />
    </div>
    
    <h3 className="text-xl font-semibold text-primary-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </div>
);

export default Benefits;
