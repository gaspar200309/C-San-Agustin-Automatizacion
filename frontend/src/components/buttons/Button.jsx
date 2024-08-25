import React from 'react';
import './Button.css';

const Button = ({ children, type = 'primary', onClick, buttonType = 'button' }) => {
  return (
    <button className={`btn ${type}`} onClick={onClick} type={buttonType}>
      {children}
    </button>
  );
};

export default Button;
