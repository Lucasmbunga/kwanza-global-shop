import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-navy-dark/95 backdrop-blur-md border-b border-gold/20"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-navy-dark" />
            </div>
            <span className="text-xl font-bold text-gold">KwanzaBuy</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#como-funciona" className="text-muted-foreground hover:text-gold transition-colors">
              Como Funciona
            </a>
            <a href="#beneficios" className="text-muted-foreground hover:text-gold transition-colors">
              Benefícios
            </a>
            <a href="#lojas" className="text-muted-foreground hover:text-gold transition-colors">
              Lojas
            </a>
            <a href="#calculadora" className="text-muted-foreground hover:text-gold transition-colors">
              Calculadora
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a href="/portal/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-gold">
                Minha Conta
              </Button>
            </a>
            <Button variant="hero" size="lg">
              Começar Agora
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gold"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-gold/20"
          >
            <nav className="flex flex-col gap-4">
              <a href="#como-funciona" className="text-muted-foreground hover:text-gold transition-colors">
                Como Funciona
              </a>
              <a href="#beneficios" className="text-muted-foreground hover:text-gold transition-colors">
                Benefícios
              </a>
              <a href="#lojas" className="text-muted-foreground hover:text-gold transition-colors">
                Lojas
              </a>
              <a href="#calculadora" className="text-muted-foreground hover:text-gold transition-colors">
                Calculadora
              </a>
              <div className="flex flex-col gap-2 pt-4">
                <a href="/portal/login">
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                    Minha Conta
                  </Button>
                </a>
                <Button variant="hero">
                  Começar Agora
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
