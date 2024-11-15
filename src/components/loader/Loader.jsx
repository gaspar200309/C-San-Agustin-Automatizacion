import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';

export default function Loader() {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [pathname]);

  return (
    <>
      {loading && <div className="loader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      }
    </>
  );
}
