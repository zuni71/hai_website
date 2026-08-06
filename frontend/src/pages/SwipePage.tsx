import { useState } from "react";
import SwipeDeck from "../components/swipe/SwipeDeck";
import { cardStrings } from "../strings";
import { type SwipeDirection } from "../components/swipe/SwipeCard";
import styles from "./SwipePage.module.css";

export default function SwipePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCard = cardStrings[activeIndex];

  const handleSwipe = (direction: SwipeDirection) => {
    switch (direction) {
      case "left":
      case "right":
        setActiveIndex((index) => (index + 1) % cardStrings.length);
    }
  };

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <p className={styles.eyebrow}>Perception of AI</p>
          <h1>HAI</h1>
          <p className={styles.subtitle}>
            React to AI in everyday life, then discuss the ones that matter
            most.
          </p>
        </div>

        <p className={styles.progress} aria-live="polite">
          <strong>{activeIndex + 1}</strong>
          <span>/ {cardStrings.length}</span>
        </p>
      </header>

      <SwipeDeck card={activeCard} onSwipe={handleSwipe} />

      <footer className={styles.footer}>
        Swipe right when the idea feels useful. Swipe left when it feels off.
        Use the arrow on a card to flip it and leave notes on the back.
      </footer>
    </section>
  );
}
