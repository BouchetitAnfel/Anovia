import React from 'react';
import Logoo from '../assets/logoo.svg';

const Title = ({ width = 140, height = 70, className = '' }) => {
  return (
    <img 
      src={Logoo} 
      alt="Anovia Suites Logo" 
      width={width} 
      height={height} 
      className={className}
    />
  );
};

export default Title;