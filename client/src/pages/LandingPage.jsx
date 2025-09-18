import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <>
      <div className="bg-gradient-to-b from-green-100 to-white">
        <HeroSection />

        {/* <div className="border-t border-gray-300 mx-auto max-w-6xl" /> */}

        <AboutSection />
      </div>

      <Footer />
    </>
  );
}
