// components/NetflixLoader.js
"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./NetflixLoader.module.css";

const AdvancedNetflixLoader = ({ duration = 3000, onComplete, interactive = true }) => {
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setLoading(false);
      if (onComplete) onComplete();
    }, duration);

    return () => clearTimeout(timerRef.current);
  }, [duration, onComplete]);

  if (!loading) return null;

  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.netflixLoader}></div>
    </div>
  );
};

export default AdvancedNetflixLoader;
