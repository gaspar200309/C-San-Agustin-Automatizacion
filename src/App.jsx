import { lazy, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/navbar/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { CourseProvider } from "./context/CourseProvider";
import { TeacherProvider } from "./context/TeacherProvider";

const LoadingComponent = () => <div className="loading-spinner">Cargando...</div>;

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
        <TeacherProvider>
        <CourseProvider>
          <BrowserRouter>
            <Navbar />
            <Suspense fallback={<LoadingComponent />}>
              <AppRoutes />
            </Suspense>
          </BrowserRouter>
          </CourseProvider>
          </TeacherProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
