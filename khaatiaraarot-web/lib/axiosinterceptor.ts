// lib/api.ts

import axios from "axios";

const BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const api = axios.create({
  baseURL: BASE,
  withCredentials: true, // sends refresh cookie
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${BASE}/api/v1/auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        );
        // console.log("refreshResponse", refreshResponse);

        const {
          accessToken,
        } = refreshResponse.data.data;

        // store new AT
        localStorage.setItem(
          "userToken",
          accessToken
        );
        //console.log("new access token", accessToken);

        // retry original request
        originalRequest.headers.Authorization =
          `Bearer ${accessToken}`;

        return api(originalRequest);
      }

      catch (refreshError: any) {
        // RT expired/invalid

        localStorage.removeItem("userToken");
        localStorage.removeItem("userName");
        //window.location.href='/login'

        return Promise.reject({
          status: 401,
          message: "Session expired",
        });
      }
    }

    return Promise.reject(error);
  }
);

export default api;