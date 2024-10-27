import React from 'react';
import { FaSearch, FaBell, FaUserCircle, FaMoon, FaSun, FaGlobe } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getUser } from '../../pages/login/authFunctions';

import './Navbar.css';

const Navbar = ({ sidebarOpen, toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const currentUser = getUser();

  return (
    <nav className="navbar">
      {currentUser ? (
        <>
          <div className="navbar-left">
            <div className="search-container">
              <FaSearch className="icon-search" />
              <input type="text" placeholder="Buscar..." />
            </div>
          </div>

          <div className="navbar-right">
            <div className="language-switch" onClick={toggleLanguage}>
              <FaGlobe className="iconN " />
              <span>{language === 'es' ? 'ES' : 'EN'}</span>
            </div>

            <div className="theme-switch" onClick={toggleTheme}>
              {theme === 'light' ? <FaMoon className="iconN" /> : <FaSun className="iconN" />}
            </div>

            <FaBell className="iconN" />
            <div className="profile-container">
              <img
                src={currentUser.photo || "ruta/de/foto/por/defecto.jpg"}
                alt="Profile"
                style={{ width: "30px", height: "30px", borderRadius: "50%" }}
              />
              <span>{currentUser.full_name}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="navbar-right">
          {/* Solo mostrar opciones de idioma y tema si no hay usuario */}
          <div className="language-switch" onClick={toggleLanguage}>
            <FaGlobe className="iconN " />
            <span>{language === 'es' ? 'ES' : 'EN'}</span>
          </div>

          <div className="theme-switch" onClick={toggleTheme}>
            {theme === 'light' ? <FaMoon className="iconN" /> : <FaSun className="iconN" />}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
