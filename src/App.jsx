import "./App.css";
import React from "react";
import Header from "./features/Header/Header";
import Main from "./features/Main/Main";
import Subreddits from "./features/Subreddits/Subreddits";
import { useState, useRef, useCallback } from "react";
import BackToTopButton from "./features/BackToTop/BackToTopButton";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

const PULL_THRESHOLD = 120;

function App() {
  const [showSubreddits, setShowSubreddits] = useState(false);
  const toggleSubreddits = () => {
    setShowSubreddits(!showSubreddits);
  };

  const contentRef = useRef(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const isPulling = useRef(false);

  const onTouchStart = useCallback((e) => {
    const el = contentRef.current;
    if (el && el.scrollTop <= 0) {
      touchStartY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  }, []);

  const onTouchMove = useCallback((e) => {
    if (!isPulling.current) return;
    const el = contentRef.current;
    if (!el || el.scrollTop > 0) {
      isPulling.current = false;
      setPullDistance(0);
      return;
    }
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) {
      // Dampen the pull (feels more natural)
      setPullDistance(Math.min(delta * 0.4, PULL_THRESHOLD + 30));
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!isPulling.current) return;
    isPulling.current = false;
    if (pullDistance >= PULL_THRESHOLD) {
      setIsRefreshing(true);
      setPullDistance(PULL_THRESHOLD * 0.5);
      // Small delay so the user sees the refreshing state
      setTimeout(() => window.location.reload(), 400);
    } else {
      setPullDistance(0);
    }
  }, [pullDistance]);

  return (
    <>
      <Header toggleSubreddits={toggleSubreddits} />

      <div
        className="content-wrapper"
        ref={contentRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {pullDistance > 0 && (
          <div
            className="pull-to-refresh-indicator"
            style={{ height: `${pullDistance}px` }}
          >
            <span
              className={`ptr-arrow ${pullDistance >= PULL_THRESHOLD ? "ptr-ready" : ""} ${isRefreshing ? "ptr-spinning" : ""}`}
            >
              ↓
            </span>
            <span className="ptr-text">
              {isRefreshing
                ? "Refreshing…"
                : pullDistance >= PULL_THRESHOLD
                  ? "Release to refresh"
                  : "Pull down to refresh"}
            </span>
          </div>
        )}

        <ErrorBoundary>
          <main className={showSubreddits ? "" : "full-width"}>
            <Main />
          </main>

          {showSubreddits && <Subreddits />}
        </ErrorBoundary>

        <BackToTopButton scrollContainerRef={contentRef} />
      </div>
    </>
  );
}

export default App;
