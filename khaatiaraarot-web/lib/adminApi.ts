import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// 1. Create a dedicated Axios instance for admin routes
const adminAxios = axios.create({
  baseURL: `${BASE}/api/v1/admin`, // Automatically prepends to all calls
  withCredentials: true,           // Sends HttpOnly refresh cookie
});

// 2. Fix TypeScript to allow custom _retry property
declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// 3. Request Interceptor: Attach adminToken
adminAxios.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("adminToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 4. Response Interceptor: Handle 401s and refresh token
adminAxios.interceptors.response.use(
  (response) => {
    // Return ONLY the data, so adminApi.get<T>() returns T directly 
    // (This perfectly mimics how your old `res.json()` worked)
    return response.data;
  },

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Use standard axios here, NOT adminAxios, so we don't trigger 
        // the interceptor loop or append /api/v1/admin to the refresh URL
        const refreshResponse = await axios.post(
          `${BASE}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );
        console.log("refreshResponse", refreshResponse);

        const newToken = refreshResponse.data.data?.accessToken;

        if (newToken) {
          localStorage.setItem("adminToken", newToken);

          // Update header and retry original request
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return adminAxios(originalRequest);
        }
      } catch (refreshError) {
        console.log("refreshResponse", refreshError);
        // Refresh token is dead. Force logout.
        localStorage.removeItem("adminToken");
        if (typeof window !== "undefined") {
          window.location.href = "/admin/login"; // Adjust if your admin login route is different
        }
        return Promise.reject(refreshError);
      }
    }

    // For all other errors, format them exactly like your old fetch wrapper did
    const message =
      (error.response?.data as any)?.message || `HTTP ${error.response?.status}`;
    return Promise.reject(new Error(message));
  }
);

// 5. Exported API object (Interface remains 100% identical to your fetch version)
export const adminApi = {
  get: <T>(path: string) => adminAxios.get<unknown, T>(path),
  
  post: <T>(path: string, body: unknown) =>
    adminAxios.post<unknown, T>(path, body),
    
  put: <T>(path: string, body: unknown) =>
    adminAxios.put<unknown, T>(path, body),
    
  patch: <T>(path: string, body: unknown) =>
    adminAxios.patch<unknown, T>(path, body),
    
  del: <T>(path: string) => adminAxios.delete<unknown, T>(path),

  upload: async <T>(path: string, field: string, file: File): Promise<T> => {
    const form = new FormData();
    form.append(field, file);
    
    // When passing FormData to Axios, it automatically sets the correct 
    // multipart/form-data Content-Type header with boundaries.
    return adminAxios.post<unknown, T>(path, form);
  },
};