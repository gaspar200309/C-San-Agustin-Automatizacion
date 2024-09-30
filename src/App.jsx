import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginUser from "./pages/login/LoginUser";
import PrivateRoute from "./components/protected/PrivateRoute";

const Home = lazy(() => import("./pages/home/Home"));
const RegisterIndicator = lazy(() =>
  import("./pages/indicadores/RegisterIndicator")
);
const UserManagement = lazy(() => import("./pages/users/ListUser"));
const TeacherForm = lazy(() => import("./pages/registerForm/TeacherForm"));
const IndicatorsList = lazy(() => import("./pages/indicadores/IndicatorList"));
const AssignIndicator = lazy(() =>
  import("./pages/indicadores/AssignIndicator")
);
const DynamicIndicator = lazy(() =>
  import("./components/dynamicIndicator/DynamicIndicator")
);
import ListTeacher from "./pages/registerForm/ListTeacher";
import EditTeacherForm from "./pages/registerForm/UpdateTeacher";

const LoadingComponent = () => <div>Loading...</div>;

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingComponent />}>
        <Routes>
          <Route
            path="/"
            element={<LoginUser />}
          />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/list-indicador/registerIndicator"
            element={
              <PrivateRoute>
                <RegisterIndicator />
              </PrivateRoute>
            }
          />
          <Route
            path="/list-indicador/asignerCordinator"
            element={
              <PrivateRoute>
                <AssignIndicator />
              </PrivateRoute>
            }
          />
          <Route
            path="/registerIndicator/:id"
            element={
              <PrivateRoute>
                <DynamicIndicator />
              </PrivateRoute>
            }
          />
          <Route
            path="/list-indicador"
            element={
              <PrivateRoute>
                <IndicatorsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/userManagement"
            element={
              <PrivateRoute>
                <UserManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/registerTeacher"
            element={
              <PrivateRoute>
                <TeacherForm />
              </PrivateRoute>
            }
          />

          <Route
            path="/listTeacher"
            element={
              <PrivateRoute>
                <ListTeacher />
              </PrivateRoute>
            }
          />
          <Route
            path="/updateTeacher/:id"
            element={
              <PrivateRoute>
                <EditTeacherForm />
              </PrivateRoute>
            }
            />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
