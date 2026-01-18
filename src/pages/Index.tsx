import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import StoresSection from "@/components/StoresSection";
import Calculator from "@/components/Calculator";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <HowItWorks />
        <Benefits />
        <StoresSection />
        <Calculator />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
