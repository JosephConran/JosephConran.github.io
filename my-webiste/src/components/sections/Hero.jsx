import BoidCanvas from "../interactive/BoidCanvas";
import AnimatedText from "../interactive/AnimatedText";
import ScrollIndicator from "../interactive/ScrollIndicator";

const Hero = () => {
  return (
    <section className="hero-section">
      <BoidCanvas />
      <div className="hero-container">
        <AnimatedText />
        <ScrollIndicator />
      </div>
    </section>
  );
};

export default Hero;
