import { cardStrings } from "../strings";
import SwipeCard from "../components/swipe/SwipeCard";
import styles from "./SwipePage.module.css";

export default function SwipePage() {
  return (
    <div className={styles.swipePage}>
      <SwipeCard card={cardStrings[0]} />
    </div>
  );
}