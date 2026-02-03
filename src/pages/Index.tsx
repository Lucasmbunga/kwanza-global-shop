import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import StoresSection from "@/components/StoresSection";
import { ProductsSection } from "@/components/ProductsSection";
import Calculator from "@/components/Calculator";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <HowItWorks />
        <Benefits />
        <ProductsSection />
        <StoresSection />
        <Calculator />
        <CTASection />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
