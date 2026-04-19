import React, { useState, useEffect } from "react";
import "./BackToTopButton.css";
import { TiArrowUp } from "react-icons/ti";

function BackToTopButton({ scrollContainerRef }) {
  const [showButton, setShowButton] = useState(false);

  const handleClick = () => {
    const el = scrollContainerRef?.current;
    if (el) {
      el.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const el = scrollContainerRef?.current;
    if (!el) return;

    const handleScroll = () => {
      setShowButton(el.scrollTop > 250);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [scrollContainerRef]);

  return (
    // Conditionally render the button based on showButton state
    showButton && (
      <button className="back-to-top" onClick={handleClick}>
        <TiArrowUp />
      </button>
    )
  );
}

export default BackToTopButton;
