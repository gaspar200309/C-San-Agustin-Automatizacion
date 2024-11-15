import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../context/PrivateRoute";
import LoginUser from "../pages/login/LoginUser";
import { lazy } from "react";

const Home = lazy(() => import("../pages/home/Home"));
const RegisterIndicator = lazy(() => import("../pages/indicadores/RegisterIndicator"));
const UserManagement = lazy(() => import("../pages/users/ListUser"));
const TeacherForm = lazy(() => import("../pages/registerForm/TeacherForm"));
const IndicatorsList = lazy(() => import("../pages/indicadores/IndicatorList"));
const AssignIndicator = lazy(() => import("../pages/indicadores/AssignIndicator"));
const DynamicIndicator = lazy(() => import("../components/dynamicIndicator/DynamicIndicator"));
const ListTeacher = lazy(() => import("../pages/registerForm/ListTeacher"));
const EditTeacherForm = lazy(() => import("../pages/registerForm/UpdateTeacher"));
const UserForm = lazy(() => import("../pages/users/RegisterUser"));
const MyCalendar = lazy(() => import("../pages/calendar/Calendar"));
const Graphics = lazy(() => import("../pages/analiticas/Graphics"));

const AppRoutes = () => (
  <Routes>
    {/* Rutas públicas */}
    <Route path="/" element={<LoginUser />} />
    
    {/* Rutas privadas */}
    <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
    <Route path="/list-indicador/asignerCordinator/registerIndicator" element={<PrivateRoute><RegisterIndicator /></PrivateRoute>} />
    <Route path="/list-indicador/asignerCordinator" element={<PrivateRoute><AssignIndicator /></PrivateRoute>} />
    <Route path="/registerIndicator/:id" element={<PrivateRoute><DynamicIndicator /></PrivateRoute>} />
    <Route path="/list-indicador" element={<PrivateRoute><IndicatorsList /></PrivateRoute>} />
    <Route path="/userManagement" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
    <Route path="/registerTeacher" element={<PrivateRoute><TeacherForm /></PrivateRoute>} />
    <Route path="/listTeacher" element={<PrivateRoute><ListTeacher /></PrivateRoute>} />
    <Route path="/editUser/:id" element={<PrivateRoute><UserForm /></PrivateRoute>} />
    <Route path="/updateTeacher/:id" element={<PrivateRoute><EditTeacherForm /></PrivateRoute>} />
    <Route path="/registerUser" element={<PrivateRoute><UserForm /></PrivateRoute>} />
    <Route path="/calendar" element={<PrivateRoute><MyCalendar /></PrivateRoute>} />
    <Route path="/graphics" element={<PrivateRoute><Graphics /></PrivateRoute>} />
  </Routes>
);

export default AppRoutes;
