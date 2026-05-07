import React from 'react';
import styles from './FormField.module.css';

const FormField = ({ label, error, children }) => {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
};

export default FormField;
