import React, { useEffect, useState } from 'react';
import styles from './EmojiFlyer.module.css';

interface EmojiFlyerProps {
  emoji: string;
  onComplete: () => void;
}

const EmojiFlyer: React.FC<EmojiFlyerProps> = ({ emoji, onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 3000); // Animation duration

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className={styles.container}>
      <div className={styles.emoji}>{emoji}</div>
    </div>
  );
};

export default EmojiFlyer;
