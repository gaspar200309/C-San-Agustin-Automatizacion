import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginUser from "./pages/login/LoginUser";
import PrivateRoute from "./context/PrivateRoute";
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/navbar/Navbar";
const Home = lazy(() => import("./pages/home/Home"));
const RegisterIndicator = lazy(() => import("./pages/indicadores/RegisterIndicator"));
const UserManagement = lazy(() => import("./pages/users/ListUser"));
const TeacherForm = lazy(() => import("./pages/registerForm/TeacherForm"));
const IndicatorsList = lazy(() => import("./pages/indicadores/IndicatorList"));
const AssignIndicator = lazy(() => import("./pages/indicadores/AssignIndicator"));
const DynamicIndicator = lazy(() => import("./components/dynamicIndicator/DynamicIndicator"));
const ListTeacher = lazy(() => import("./pages/registerForm/ListTeacher"));
const EditTeacherForm = lazy(() => import("./pages/registerForm/UpdateTeacher"));
const UserForm = lazy(() => import("./pages/users/RegisterUser"));
const MyCalendar = lazy(() => import("./pages/calendar/Calendar"));

const LoadingComponent = () => <div className="loading-spinner">Cargando...</div>;

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<LoginUser />} />
            <Route path="/home" element={<PrivateRoute><Suspense fallback={<LoadingComponent />}><Home /></Suspense></PrivateRoute>} />
            <Route path="/list-indicador/asignerCordinator/registerIndicator" element={<PrivateRoute><Suspense fallback={<LoadingComponent />}><RegisterIndicator /></Suspense></PrivateRoute>} />
            <Route path="/list-indicador/asignerCordinator" element={<PrivateRoute><Suspense fallback={<LoadingComponent />}><AssignIndicator /></Suspense></PrivateRoute>} />
            <Route path="/registerIndicator/:id" element={<PrivateRoute><Suspense fallback={<LoadingComponent />}><DynamicIndicator /></Suspense></PrivateRoute>} />
            <Route path="/list-indicador" element={<PrivateRoute><Suspense fallback={<LoadingComponent />}><IndicatorsList /></Suspense></PrivateRoute>} />
            <Route path="/userManagement" element={<PrivateRoute><Suspense fallback={<LoadingComponent />}><UserManagement /></Suspense></PrivateRoute>} />
            <Route path="/registerTeacher" element={<PrivateRoute><Suspense fallback={<LoadingComponent />}><TeacherForm /></Suspense></PrivateRoute>} />
            <Route path="/listTeacher" element={<PrivateRoute><Suspense fallback={<LoadingComponent />}><ListTeacher /></Suspense></PrivateRoute>} />
            <Route path="/editUser/:id" element={<PrivateRoute><Suspense fallback={<LoadingComponent />}><UserForm /></Suspense></PrivateRoute>} />
            <Route path="/updateTeacher/:id" element={<PrivateRoute><Suspense fallback={<LoadingComponent />}><EditTeacherForm /></Suspense></PrivateRoute>} />
            <Route path="/registerUser" element={<PrivateRoute><Suspense fallback={<LoadingComponent />}><UserForm /></Suspense></PrivateRoute>} />
            <Route path="/calendar" element={<PrivateRoute><Suspense fallback={<LoadingComponent />}><MyCalendar /></Suspense></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
