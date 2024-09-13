import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginUser from './pages/login/LoginUser';
import Home from './pages/home/Home';
import PrivateRoute from './components/protected/PrivateRoute';

import Indicator1 from './components/forms/Indicator1';
import Indicador11 from './pages/indicadores/ListIndicador';
import RegisterIndicator from './pages/indicadores/RegisterIndicator';
import Indicator2 from './components/forms/Indicator2';
import Indicator3 from './components/forms/Indicator3';
import Indicator4 from './components/forms/Indicator4';
import Indicator6 from './components/forms/Indicator6';
import Indicator7 from './components/forms/Indicator7';
import Indicator8 from './components/forms/Indicator8';
import Indicator10 from './components/forms/Indicator10';
import Indicator11 from './components/forms/Indicator11';
import UserManagement from './pages/users/ListUser';
import TeacherForm from './pages/registerForm/TeacherForm';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginUser />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path='/list-indicador' element={<PrivateRoute><Indicador11/></PrivateRoute>}/>
        <Route path = '/list-indicador/registerIndicator' element = {<PrivateRoute><RegisterIndicator/></PrivateRoute>} />
        <Route path="/indicador1" element={<PrivateRoute><Indicator1 /></PrivateRoute>} />
        <Route path="/indicador2" element={<PrivateRoute><Indicator2 /></PrivateRoute>} />
        <Route path="/indicador3" element={<PrivateRoute><Indicator3 /></PrivateRoute>} />
        <Route path="/indicador4" element={<PrivateRoute><Indicator4 /></PrivateRoute>} />
        <Route path="/indicador6" element={<PrivateRoute><Indicator6 /></PrivateRoute>} />
        <Route path="/indicador7" element={<PrivateRoute><Indicator7 /></PrivateRoute>} />
        <Route path="/indicador8" element={<PrivateRoute><Indicator8 /></PrivateRoute>}/>
        <Route path="/indicador10" element={<PrivateRoute><Indicator10 /></PrivateRoute>}/>
        <Route path='/Indicador11' element = {<PrivateRoute><Indicator11/></PrivateRoute>}/>
        <Route path="/userManagement" element={<PrivateRoute><UserManagement /></PrivateRoute>}/>


        <Route path='/registerTeacher' element = {<PrivateRoute><TeacherForm/></PrivateRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
