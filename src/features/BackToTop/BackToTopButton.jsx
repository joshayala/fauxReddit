import React, { useState, useEffect } from 'react';
import './BackToTopButton.css'; 
import { TiArrowUp } from "react-icons/ti";

function BackToTopButton() {
  const [showButton, setShowButton] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 250) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // Conditionally render the button based on showButton state
    showButton && (
      <button
        className="back-to-top"
        onClick={handleClick}
      >
        <TiArrowUp />
      </button>
    )
  );
}

export default BackToTopButton;
