import React from 'react';
import './Switch.css';

const Switch = ({ onChange, checked, rounded = false }) => {
  return (
    <label className='switch'>
        <input 
          type="checkbox" 
          onChange={onChange} 
          checked={checked} 
        />
        <span className={`slider ${rounded ? 'rounded' : ''}`} />
    </label>
  )
}

export default Switch;
