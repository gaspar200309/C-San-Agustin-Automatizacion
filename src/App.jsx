import { lazy, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/navbar/Navbar";
import AppRoutes from "./routes/AppRoutes";

const LoadingComponent = () => <div className="loading-spinner">Cargando...</div>;

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Navbar />
            <Suspense fallback={<LoadingComponent />}>
              <AppRoutes />
            </Suspense>
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
