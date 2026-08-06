import { useEffect, useRef, useState, type PointerEvent } from "react";
import { type CardStrings } from "../../strings";
import styles from "./SwipeCard.module.css";

interface SwipeCardProps {
  card: CardStrings;
  onSwipe?: (direction: SwipeDirection) => void;
}

const SWIPE_THRESHOLD = 72;
const RESET_TRANSITION = "transform 220ms ease, opacity 220ms ease";
const EXIT_TRANSITION = "transform 260ms ease, opacity 260ms ease";

export type SwipeDirection = "left" | "right";

export default function SwipeCard({ card, onSwipe }: SwipeCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const gesture = useRef({
    pointerId: null as number | null,
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    frameId: null as number | null,
  });
  const exitTimer = useRef<number | null>(null);
  const isExiting = useRef(false);

  const flipCard = () => setIsFlipped((flipped) => !flipped);

  const isInteractiveTarget = (target: EventTarget | null) =>
    target instanceof Element &&
    Boolean(target.closest("button, textarea, input, label"));

  const renderDragPosition = () => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    const { x, y } = gesture.current;
    const rotation = Math.max(-14, Math.min(14, x / 16));

    cardElement.style.transform = `translate3d(${x}px, ${y * 0.15}px, 0) rotate(${rotation}deg)`;
    cardElement.style.opacity = String(Math.max(0.35, 1 - Math.abs(x) / 340));
  };

  const resetCardPosition = () => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    cardElement.style.transition = RESET_TRANSITION;
    cardElement.style.transform = "translate3d(0, 0, 0)";
    cardElement.style.opacity = "1";
  };

  const finishSwipe = (direction: SwipeDirection) => {
    const cardElement = cardRef.current;
    if (!cardElement || isExiting.current) return;

    isExiting.current = true;
    const distance = (cardElement.getBoundingClientRect().width + 160) *
      (direction === "right" ? 1 : -1);

    cardElement.style.transition = EXIT_TRANSITION;
    cardElement.style.transform = `translate3d(${distance}px, 0, 0) rotate(${direction === "right" ? 18 : -18}deg)`;
    cardElement.style.opacity = "0";

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    exitTimer.current = window.setTimeout(
      () => onSwipe?.(direction),
      prefersReducedMotion ? 0 : 260,
    );
  };

  useEffect(
    () => () => {
      if (gesture.current.frameId !== null) {
        window.cancelAnimationFrame(gesture.current.frameId);
      }
      if (exitTimer.current !== null) {
        window.clearTimeout(exitTimer.current);
      }
    },
    [],
  );

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (isExiting.current || isInteractiveTarget(event.target)) return;

    gesture.current.pointerId = event.pointerId;
    gesture.current.startX = event.clientX;
    gesture.current.startY = event.clientY;
    gesture.current.x = 0;
    gesture.current.y = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.style.transition = "none";
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (gesture.current.pointerId !== event.pointerId) return;

    gesture.current.x = event.clientX - gesture.current.startX;
    gesture.current.y = event.clientY - gesture.current.startY;

    if (gesture.current.frameId !== null) return;

    gesture.current.frameId = window.requestAnimationFrame(() => {
      gesture.current.frameId = null;
      renderDragPosition();
    });
  };

  const stopTrackingPointer = (event: PointerEvent<HTMLElement>) => {
    if (gesture.current.pointerId !== event.pointerId) return false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    gesture.current.pointerId = null;
    return true;
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    if (!stopTrackingPointer(event)) return;

    gesture.current.x = event.clientX - gesture.current.startX;
    gesture.current.y = event.clientY - gesture.current.startY;

    if (gesture.current.frameId !== null) {
      window.cancelAnimationFrame(gesture.current.frameId);
      gesture.current.frameId = null;
    }

    renderDragPosition();

    const { x: horizontalDistance, y: verticalDistance } = gesture.current;

    if (
      Math.abs(horizontalDistance) < SWIPE_THRESHOLD ||
      Math.abs(horizontalDistance) <= Math.abs(verticalDistance)
    ) {
      resetCardPosition();
      return;
    }

    finishSwipe(horizontalDistance < 0 ? "left" : "right");
  };

  const handlePointerCancel = (event: PointerEvent<HTMLElement>) => {
    if (!stopTrackingPointer(event)) return;

    if (gesture.current.frameId !== null) {
      window.cancelAnimationFrame(gesture.current.frameId);
      gesture.current.frameId = null;
    }

    resetCardPosition();
  };

  return (
    <article
      ref={cardRef}
      className={`${styles.card} ${isFlipped ? styles.isFlipped : ""}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
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
              onClick={() => finishSwipe("right")}
            >
              Agree
            </button>

            <button
              type="button"
              className={`${styles.actionBtn} ${styles.negative}`}
              onClick={() => finishSwipe("left")}
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
