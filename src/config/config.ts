import axios, { AxiosInstance } from "axios";
import { authenticationService } from "./urlConfig";

function getAuth() {
  return `${authenticationService.baseUrl}`;
}

function getAuthURL(): AxiosInstance {
  let Auth = axios.create({
    baseURL: authenticationService.baseUrl
  });

  const token = localStorage.getItem("token");
  if (token) {
    Auth.defaults.headers.common["authorization"] = `Bearer ${token}`;
  }

  return Auth;
}

export const Auth = getAuth();
export const AuthURL = getAuthURL();
