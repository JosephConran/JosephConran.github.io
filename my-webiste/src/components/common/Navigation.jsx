import React from "react";

const Navigation = () => {
  return (
    <header className="navigation">
      <div className="nav-container">
        <div className="nav-logo">Joseph Conran</div>
        <nav className="nav-links">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
