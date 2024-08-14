import React from "react";
import { isTokenValid } from "../../utils/Auth";
import { getToken } from "../../pages/login/authFunctions";
import { Navigate } from 'react-router-dom';
import {Sidebar} from "../navbar/Sid";


const PrivateRoute = ({ children }) => {
  const token = getToken();
  const tokenExistAndStillValid = token && isTokenValid(token);
  return tokenExistAndStillValid ? (
    <>
      <Sidebar/>
      {children}
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoute;
