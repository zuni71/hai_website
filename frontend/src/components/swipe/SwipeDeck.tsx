import { useState } from "react";
import { cardStrings } from "../../strings";
import SwipeCard, { type SwipeDirection } from "./SwipeCard";
import styles from "./SwipeDeck.module.css";

export default function SwipeDeck() {
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
    <section className={styles.deck} aria-label="AI conversation cards">
      <SwipeCard
        key={activeCard.id}
        card={activeCard}
        onSwipe={handleSwipe}
      />
    </section>
  );
}
