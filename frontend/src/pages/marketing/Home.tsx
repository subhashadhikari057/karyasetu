import Navbar from "../../components/marketing/Navbar";
import HeroSection from "../../components/marketing/HeroSection";
import Footer from "../../components/marketing/Footer";
import About from "../../components/marketing/About";
import Modules from "../../components/marketing/Modules";
import WhyChooseUs from "../../components/marketing/WhyChooseUs";
import Spotlight from "../../components/marketing/Spotlight";

export default function Home() {
  return (
    <>
    <Spotlight/>
    <Navbar/>
    <HeroSection/>
    <About/>
    <Modules/>
    <WhyChooseUs/>
    <Footer/>

      {/* other sections … */}
    </>
  );
}
