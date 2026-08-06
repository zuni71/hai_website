import { type CardStrings } from "../../strings";
import SwipeCard, { type SwipeDirection } from "./SwipeCard";
import styles from "./SwipeDeck.module.css";

interface SwipeDeckProps {
  card: CardStrings;
  onSwipe: (direction: SwipeDirection) => void;
}

export default function SwipeDeck({ card, onSwipe }: SwipeDeckProps) {
  return (
    <section className={styles.deck} aria-label="AI conversation cards">
      <SwipeCard key={card.id} card={card} onSwipe={onSwipe} />
    </section>
  );
}
