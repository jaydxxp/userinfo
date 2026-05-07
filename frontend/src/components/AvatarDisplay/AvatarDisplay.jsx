import React from 'react';
import { User as UserIcon } from 'lucide-react';
import styles from './AvatarDisplay.module.css';

const AvatarDisplay = ({ src, size = 120 }) => {
  return (
    <div className={styles.container} style={{ width: size, height: size }}>
      {src ? (
        <img src={src} alt="Profile" className={styles.img} />
      ) : (
        <UserIcon size={size * 0.33} color="#cbd5e1" />
      )}
    </div>
  );
};

export default AvatarDisplay;
