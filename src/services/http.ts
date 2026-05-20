import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { API_ENDPOINTS } from "./apiEndpoints";

// Extend the request config to include retry flag
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Create axios instance with default configuration
const httpClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach auth token
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Try to get token from localStorage first, then sessionStorage
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    if (token && config.headers) {
      config.headers.Authorization = `${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("[HTTP] Request error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor for error handling and token management
httpClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(
        `[HTTP] ${response.status} ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        {
          data: response.data,
        },
      );
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      console.warn("[HTTP] 401 Unauthorized - Token may be expired");

      // Try to refresh token if available
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Attempt token refresh
          const response = await axios.post(
            `${httpClient.defaults.baseURL}${API_ENDPOINTS.auth.refresh}`,
            new URLSearchParams({
              refresh_token: refreshToken,
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            },
          );

          const newToken = response.data.token;

          // Update stored tokens
          if (localStorage.getItem("authToken")) {
            localStorage.setItem("authToken", newToken);
          } else {
            localStorage.setItem("authToken", newToken);
          }

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          return httpClient(originalRequest);
        } catch (refreshError) {
          console.error("[HTTP] Token refresh failed:", refreshError);

          // Clear all auth data and redirect to login
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
          sessionStorage.removeItem("authToken");
          sessionStorage.removeItem("refreshToken");

          // Trigger logout event (can be listened to by auth context)
          window.dispatchEvent(new CustomEvent("auth:logout"));

          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token or retry already attempted
        // Clear auth data and trigger logout
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("refreshToken");

        window.dispatchEvent(new CustomEvent("auth:logout"));
      }
    }

    // Log other errors
    if (error.response) {
      // Server responded with error status
      console.error(
        `[HTTP] ${
          error.response.status
        } ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        {
          data: error.response.data,
          headers: error.response.headers,
        },
      );
    } else if (error.request) {
      // Network error or no response
      console.error("[HTTP] Network error:", error.message);
    } else {
      // Other error
      console.error("[HTTP] Error:", error.message);
    }

    return Promise.reject(error);
  },
);

export default httpClient;

// Export types for use in other services
export type { AxiosResponse, AxiosError, InternalAxiosRequestConfig };
