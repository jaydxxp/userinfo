import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from './PageHeader.module.css';

const PageHeader = ({ title, backTo = '/', backLabel = 'Back to list' }) => {
  return (
    <div className={styles.header}>
      <Link to={backTo} className={styles.backBtn}>
        <ArrowLeft size={16} />
        {backLabel}
      </Link>
      <div className={styles.title}>
        <h1>{title}</h1>
      </div>
    </div>
  );
};

export default PageHeader;
