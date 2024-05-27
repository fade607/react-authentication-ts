import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/Home";
import LoginPage from "../pages/auth/LoginPage";
import Register from "../pages/auth/Register";
import PageNotFound from "../pages/errors/PageNotFound";
import RegisterWithEmailOTP from "../pages/auth/RegisterWithEmailOTP";
import ForgotPassword from "../pages/auth/ForgotPassword";


export const unAuthenticated = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/register-with-otp",
        element: <RegisterWithEmailOTP />
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />
    },
    {
        path: "*",
        element: <PageNotFound />
    },

]);

export const authenticated = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '*',
        element: <PageNotFound />
    }
])