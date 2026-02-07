import Hero from "../src/components/sections/Hero";
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import SkillsPlayground from "./components/sections/SkillsPlayground";
import Footer from "./components/common/Footer";
import "./styles/global.css";

function App() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <SkillsPlayground />
      <Footer />
    </main>
  );
}

export default App;
