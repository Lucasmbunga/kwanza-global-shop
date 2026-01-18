import { motion } from "framer-motion";
import { Search, CreditCard, Package, Home } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Escolha o Produto",
    description: "Navegue em qualquer loja internacional e cole o link do produto que deseja comprar.",
    step: "01"
  },
  {
    icon: CreditCard,
    title: "Pague em Kwanza",
    description: "Receba o valor convertido em Kwanza e pague com Multicaixa, transferência ou dinheiro.",
    step: "02"
  },
  {
    icon: Package,
    title: "Nós Compramos",
    description: "Nossa equipe realiza a compra, trata da importação e desalfandegamento.",
    step: "03"
  },
  {
    icon: Home,
    title: "Receba em Casa",
    description: "Entregamos o seu produto diretamente na sua porta, em qualquer parte de Angola.",
    step: "04"
  }
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-24 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Simples & Rápido
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Como Funciona
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Em apenas 4 passos simples, você pode comprar qualquer produto do mundo
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StepCard {...step} isLast={index === steps.length - 1} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StepCard = ({ 
  icon: Icon, 
  title, 
  description, 
  step, 
  isLast 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  step: string;
  isLast: boolean;
}) => (
  <div className="relative group">
    {/* Connection Line */}
    {!isLast && (
      <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-gold/50 to-transparent z-0" />
    )}
    
    <div className="relative bg-card rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300 border border-border hover:border-gold/30 group-hover:-translate-y-1">
      {/* Step Number */}
      <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-sm font-bold text-navy-dark shadow-gold">
        {step}
      </div>
      
      {/* Icon */}
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
        <Icon className="w-7 h-7 text-primary group-hover:text-gold transition-colors" />
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

export default HowItWorks;
