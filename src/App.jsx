import "./App.css";
import React from "react";
import Header from "./features/Header/Header";
import Main from "./features/Main/Main";
import Subreddits from "./features/Subreddits/Subreddits";
import { useState } from "react";
import BackToTopButton from "./features/BackToTop/BackToTopButton";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

function App() {
  const [showSubreddits, setShowSubreddits] = useState(false);
  const toggleSubreddits = () => {
    setShowSubreddits(!showSubreddits);
  };

  return (
    <>
      <Header toggleSubreddits={toggleSubreddits} />

      <ErrorBoundary>
        <main className={showSubreddits ? "" : "full-width"}>
          <Main />
        </main>

        {showSubreddits && <Subreddits />}
      </ErrorBoundary>

      <BackToTopButton />
    </>
  );
}

export default App;
