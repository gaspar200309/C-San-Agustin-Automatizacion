import React, { useState } from "react";
import { isTokenValid } from "../utils/Auth";
import { getToken } from "../pages/login/authFunctions";
import { Navigate } from 'react-router-dom';
import { Sidebar } from "../components/navbar/Sid"; // Sidebar component
import Loader from "../components/loader/Loader";

const PrivateRoute = ({ children }) => {
  const token = getToken();
  const tokenExistAndStillValid = token && isTokenValid(token);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return tokenExistAndStillValid ? (
    <div className={`app-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
    <Loader />
      
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className="main-content">
        {children}
      </main>

    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoute;
