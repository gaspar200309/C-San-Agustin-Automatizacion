import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Breadcrumb.css'

const Breadcrumb = () => {
  const navigate = useNavigate();
  const paths = window.location.pathname.split('/').filter(path => path);

  return (
    <nav>
      {paths.map((path, index) => {
        const to = `/${paths.slice(0, index + 1).join('/')}`;
        return index === paths.length - 1 ? (
          <span key={to}>{path.replace(/-/g, ' ')}</span>
        ) : (
          <Link
            key={to}
            to={to}
            onClick={(e) => {
              e.preventDefault();
              navigate(to);
            }}
            style={{ textDecoration: 'none', color: 'blue' }}
          >
            {path.replace(/-/g, ' ')} &gt; {' '}
          </Link>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;