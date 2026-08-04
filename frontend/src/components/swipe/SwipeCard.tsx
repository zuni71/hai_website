import { useState } from "react";
import { type CardStrings } from "../../strings";
import styles from "./SwipeCard.module.css";

interface SwipeCardProps {
  card: CardStrings;
}

export default function SwipeCard({ card }: SwipeCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = () => setIsFlipped((flipped) => !flipped);

  return (
    <article className={`${styles.card} ${isFlipped ? styles.isFlipped : ""}`}>
      {/* Front */}
      <div className={`${styles.cardFace} ${styles.cardFront}`}>
        <div className={styles.cardContent}>
          <div className={styles.topicChip}>{"AI in" +" "+card.topic}</div>

          <div className={styles.headlineBlock}>
            <h2>{card.headline}</h2>
            <p className={styles.cardCopy}>{card.snapshot}</p>
          </div>
        </div>

        <div className={styles.cardBottom}>
          <div className={styles.cardStats}>
            <div className={styles.stat}>
              <span>Angle</span>
              <strong>{card.angle}</strong>
            </div>

            <div className={styles.stat}>
              <span>Hope</span>
              <strong>{card.hope}</strong>
            </div>

            <div className={styles.stat}>
              <span>Topic</span>
              <strong>{card.topic}</strong>
            </div>
          </div>

          <div className={styles.swipeHint}>
            <span>Swipe to respond</span>

            <div className={styles.swipeSignals}>
              <span className={`${styles.signal} ${styles.pass}`}>
                ← Pass
              </span>
              <span className={`${styles.signal} ${styles.like}`}>
                Like →
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Back */}
      <div className={`${styles.cardFace} ${styles.cardBack}`}>
        <div className={styles.commentGrid}>
          <div>
            <div className={styles.topicChip}>{"AI in " + card.topic}</div>

            <h3>What do you think?</h3>

            <p>
              Share your perspective on AI in {card.topic.toLowerCase()}.
            </p>
          </div>

          <div className={styles.commentField}>
            <label htmlFor={`comment-${card.id}`}>
              Your perspective
            </label>

            <textarea
              id={`comment-${card.id}`}
              placeholder="Add a thought..."
            />
            <label htmlFor={`background-${card.id}`}>
              Your Background
            </label>

            <textarea
              id={`background-${card.id}`}
              placeholder="Share your background..."
            />
          </div>


          <div className={styles.cardActions}>
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.secondary}`}
              onClick={() => setIsFlipped(false)}
            >
              Back
            </button>

            <button
              type="button"
              className={`${styles.actionBtn} ${styles.positive}`}
            >
              Agree
            </button>

            <button
              type="button"
              className={`${styles.actionBtn} ${styles.negative}`}
            >
              Pass
            </button>
          </div>
        </div>
      </div>

      {/* Temporary development control */}
      <button
        type="button"
        className={styles.flipButton}
        onClick={flipCard}
        aria-label={isFlipped ? "Show card front" : "Show card back"}
      >
        {isFlipped ? "↩" : "↗"}
      </button>
    </article>
  );
}