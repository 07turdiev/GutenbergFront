import React, { useEffect, useState } from 'react';
import classes from './style.module.scss';

interface TopProgressBarProps {
  isLoading: boolean;
}

const TopProgressBar: React.FC<TopProgressBarProps> = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const timer = setTimeout(() => setProgress(30), 100);
      const timer2 = setTimeout(() => setProgress(60), 300);
      const timer3 = setTimeout(() => setProgress(90), 600);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 200);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!isLoading && progress === 0) {
    return null;
  }

  return (
    <>
      {isLoading && <div className={classes.screenBlur} />}
      <div className={classes.progressBar}>
        <div 
          className={classes.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
};

export default TopProgressBar; 