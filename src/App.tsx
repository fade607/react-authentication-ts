import React from 'react';
import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/auth/LoginPage';
import { unAuthenticated, authenticated } from './Routes/Routes';
import { RouterProvider } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from "react-redux";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { store, RootState } from './redux/store';

function App() {

  const isAuthenticated = localStorage.getItem('token');
  const { authenticated: userLoggedIn } = useSelector((state: RootState) => state.signin);

  return (
    <div>
      <RouterProvider router={isAuthenticated || userLoggedIn ? authenticated : unAuthenticated} />
      <ToastContainer />
    </div>
  );
}

export default App;
