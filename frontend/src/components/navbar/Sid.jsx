import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { IoIosArrowBack, FaHome, FaUserGraduate, TbLogout, AiOutlineGroup, MdNotifications, GiReceiveMoney, GrMoney } from '../../hooks/icons';
import { useTheme } from '../../hooks/useTheme';
import { signOut } from '../../pages/login/authFunctions';

const SidebarHeader = ({ onToggle, isOpen }) => (
  <header className="sidebar-header">
    <div className="text logo">
      <span className="name">Administrador</span>
      <span className="profe">Armando Gaspar</span>
    </div>
    <IoIosArrowBack className={`toggle ${isOpen ? '' : 'reverse'}`} onClick={onToggle} />
  </header>
);

const SidebarLink = ({ to, icon, text }) => (
  <li className="nav-link">
    <Link to={to}>
      <i className="icon">{icon}</i>
      <span className="text nav-text">{text}</span>
    </Link>
  </li>
);

export const SidebarSearch = () => (
  <li className="search-box">
    <i className="bx bx-search icon"></i>
    <input type="text" placeholder="Buscar..." />
  </li>
);

const SidebarLogout = () => (
  <li>
    <Link to="/logout" onClick={signOut}>
      <i className="icon"><TbLogout /></i>
      <span className="text nav-text">Cerrar sesión</span>
    </Link>
  </li>
);

const SidebarThemeToggle = ({ theme, toggleTheme }) => (
  <li className="mode">
    <div className="sun-moon">
      <i className={`icon moon ${theme === 'dark' ? 'active' : ''}`} />
      <i className={`icon sun ${theme === 'light' ? 'active' : ''}`} />
    </div>
    <span className="mode-text text">Modo Oscuro</span>
    <div className="toggle-switch" onClick={toggleTheme}>
      <span className={`switch ${theme === 'dark' ? 'active' : ''}`} />
    </div>
  </li>
);

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <nav className={`sidebar ${isOpen ? 'open' : 'close'}`}>
      <div className="menu-bar">
        <SidebarHeader onToggle={toggleSidebar} isOpen={isOpen} />
        <div className="menu">
          {/* <SidebarSearch /> */}
          <ul className="menu-links">
            <SidebarLink to="/home" icon={<FaHome />} text="Dashboard" />
            <SidebarLink to="/list-indicador" icon={<GiReceiveMoney />} text="Indicadores" />
            <SidebarLink to="/registerProf" icon={<MdNotifications />} text="Notificaciones" />
            <SidebarLink to="/analiticas" icon={<AiOutlineGroup />} text="Analiticas" />
            <SidebarLink to="/me-gustas" icon={<FaUserGraduate />} text="Me gustas" />
            <SidebarLink to="/carteras" icon={<GrMoney />} text="Carteras" />
          </ul>
        </div>
        <div className="bottom-content">
          <SidebarLogout />
          <SidebarThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </nav>
  );
};
