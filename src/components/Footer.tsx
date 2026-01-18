import { ShoppingBag, Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy-dark border-t border-gold/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-navy-dark" />
              </div>
              <span className="text-xl font-bold text-gold">KwanzaBuy</span>
            </a>
            <p className="text-muted-foreground text-sm mb-6">
              Conectando Angola ao mundo. Compre internacionalmente, pague em Kwanza.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold/20 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold/20 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold/20 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Links Rápidos</h4>
            <ul className="space-y-3">
              <li><a href="#como-funciona" className="text-muted-foreground hover:text-gold transition-colors text-sm">Como Funciona</a></li>
              <li><a href="#beneficios" className="text-muted-foreground hover:text-gold transition-colors text-sm">Benefícios</a></li>
              <li><a href="#lojas" className="text-muted-foreground hover:text-gold transition-colors text-sm">Lojas Parceiras</a></li>
              <li><a href="#calculadora" className="text-muted-foreground hover:text-gold transition-colors text-sm">Calculadora</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-gold transition-colors text-sm">Termos de Uso</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-gold transition-colors text-sm">Política de Privacidade</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-gold transition-colors text-sm">Política de Reembolso</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-gold transition-colors text-sm">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-gold" />
                info@kwanzabuy.ao
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 text-gold" />
                +244 923 456 789
              </li>
              <li className="flex items-start gap-3 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-gold mt-0.5" />
                Luanda, Angola
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gold/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2025 KwanzaBuy. Todos os direitos reservados.
          </p>
          <p className="text-muted-foreground text-sm">
            Feito com 💛 em Angola
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
