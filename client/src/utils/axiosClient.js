import axios from "axios";
import { KEY_ACCESS_TOKEN } from "./localStorageManager";
import { setLoading, showToast } from "../redux/slices/appConfigSlice";
import store from "../redux/store";
import { TOAST_FAILURE } from "../App";

export const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_URL,
  withCredentials: true, //cookies bhejne ke liye
});

axiosClient.interceptors.request.use(async (request) => {
  store.dispatch(setLoading(true));
  const accessToken = localStorage.getItem(KEY_ACCESS_TOKEN);
  request.headers["Authorization"] = `Bearer ${accessToken}`;
  return request;
});

axiosClient.interceptors.response.use(
  async (response) => {
    store.dispatch(setLoading(false));
    const data = response.data;
    if (data.status === "ok") {
      return response;
    }

    const originalRequest = response.config;
    const statusCode = data.statusCode;
    const error = data.message;
    store.dispatch(
      showToast({
        type: TOAST_FAILURE,
        message: error,
      })
    );
    // if (statusCode === 401 && originalRequest.url === "/auth/refreh") { // means the refreshToken expired and we have to logout the user
    //   localStorage.removeItem(KEY_ACCESS_TOKEN);
    //   window.location.replace("/login", "_self");
    //   return Promise.reject(error);
    // }
    if (statusCode === 401) {
      //means the access Token Expired
      const response = await axios
        .create({
          withCredentials: true,
        })
        .get(process.env.REACT_APP_SERVER_BASE_URL + "/auth/refresh");
      console.log("Refresh From Backend", response);

      if (response.data.status === "ok") {
        localStorage.setItem(
          KEY_ACCESS_TOKEN,
          response.data.result.accessToken
        );
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data.result.accessToken}`;
        return axios(originalRequest);
      } else {
        // refreshToken Expired ho gya to logout karwa diye
        localStorage.removeItem(KEY_ACCESS_TOKEN);
        window.location.replace("/login", "_self");
        return Promise.reject(error);
      }
    }
    console.log("error", error);
    return Promise.reject(error);
  },
  async (error) => {
    store.dispatch(setLoading(false));
    store.dispatch(
      showToast({
        type: TOAST_FAILURE,
        message: error,
      })
    );
    return Promise.reject(error);
  }
);
