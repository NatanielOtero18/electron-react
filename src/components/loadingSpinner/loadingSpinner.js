import React from 'react';
import styles from './loadingSpinner.module.css'

const LoadingSpinner = (props) => {
    return (
        <div className={styles.spinnerContainer}>
          <div className={styles.loadingSpinner}>          
          </div>
        </div>
      );
}

export default LoadingSpinner;