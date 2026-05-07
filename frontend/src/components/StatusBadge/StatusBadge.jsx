import React from 'react';
import styles from './StatusBadge.module.css';

const StatusBadge = ({ status }) => {
  return (
    <span className={`${styles.badge} ${status === 'Active' ? styles.active : styles.inactive}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
