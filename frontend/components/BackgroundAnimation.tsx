import React from 'react';
import styles from './BackgroundAnimation.module.css';

const BackgroundAnimation: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Ambient Glows */}
      <div className={`${styles.glow} ${styles.glowBlue}`}></div>
      <div className={`${styles.glow} ${styles.glowPurple}`}></div>

      {/* Floating Geometric Shapes */}
      <div className={`${styles.shape} ${styles.circle} ${styles.s1}`}></div>
      <div className={`${styles.shape} ${styles.circle} ${styles.s2}`}></div>
      
      <div className={`${styles.shape} ${styles.rect} ${styles.s3}`}></div>
      <div className={`${styles.shape} ${styles.rect} ${styles.s4}`}></div>

      <div className={`${styles.shape} ${styles.triangle} ${styles.s5}`}></div>
      <div className={`${styles.shape} ${styles.triangle} ${styles.s6}`}></div>

      {/* Particles / Dots - More visible and varied */}
      <div className={styles.shape} style={{ top: '15%', left: '85%', width: '10px', height: '10px', background: '#22d3ee', borderRadius: '50%', opacity: 0.6, filter: 'blur(1px)' }}></div>
      <div className={styles.shape} style={{ top: '75%', left: '15%', width: '8px', height: '8px', background: '#a78bfa', borderRadius: '50%', opacity: 0.5, filter: 'blur(1px)' }}></div>
      <div className={styles.shape} style={{ top: '35%', left: '5%', width: '12px', height: '12px', background: '#60a5fa', borderRadius: '50%', opacity: 0.4, filter: 'blur(2px)' }}></div>
      <div className={styles.shape} style={{ top: '90%', left: '60%', width: '6px', height: '6px', background: '#c4b5fd', borderRadius: '50%', opacity: 0.7 }}></div>
      <div className={styles.shape} style={{ top: '5%', left: '35%', width: '5px', height: '5px', background: '#ffffff', borderRadius: '50%', opacity: 0.8 }}></div>
      <div className={styles.shape} style={{ top: '50%', left: '90%', width: '7px', height: '7px', background: '#60a5fa', borderRadius: '50%', opacity: 0.5 }}></div>
      <div className={styles.shape} style={{ top: '80%', left: '40%', width: '4px', height: '4px', background: '#22d3ee', borderRadius: '50%', opacity: 0.6 }}></div>
    </div>
  );
};

export default BackgroundAnimation;
