import React, { FC } from 'react'
import styles from './LoadingSpinner.module.css'

const LoadingSpinner: FC = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
    </div>
  )
}

export default LoadingSpinner
