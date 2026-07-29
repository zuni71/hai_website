import { type ReactNode } from "react";
import styles from "./AppLayout.module.css";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={styles.appShell}>
      <div className={`${styles.ambient} ${styles.ambientA}`} />
      <div className={`${styles.ambient} ${styles.ambientB}`} />

      <main className={styles.phoneFrame}>
        {children}
      </main>
    </div>
  );
}