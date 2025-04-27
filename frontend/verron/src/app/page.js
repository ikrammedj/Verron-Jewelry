'use client'
import StickyNavbar from "./Components/StickyNavbar";
import Accueil from "./Components/Accueil";
import NosBijoux from "./Components/NosBijoux";
import Sidebar from "./Components/Sidebar";
import Apropos from "./Components/Apropos";
import Footer from "./Components/Footer";
import Footer2 from "./Components/Footer2";
import AnimatedSection from "./Components/AnimatedSection";
import './page.css';

export default function Home() {
  return (
    <div className="relative bg-[#F7F1EB] min-h-screen">
      <StickyNavbar />
      <Sidebar />
      <AnimatedSection>
        <Accueil />
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <NosBijoux />
      </AnimatedSection>

      <AnimatedSection delay={0.4}>
        <Apropos />
      </AnimatedSection>

      <AnimatedSection delay={0.5}>
        <Footer />
      </AnimatedSection>

      <Footer2 />
    </div>
  );
}