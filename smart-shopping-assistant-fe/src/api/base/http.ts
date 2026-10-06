import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

function extractMessage(error: {
  message?: string;
  response?: { data?: unknown };
}): string {
  const data = error.response?.data;
  if (typeof data === "string" && data !== "") return data;
  if (data && typeof data === "object") {
    const body = data as {
      message?: string;
      title?: string;
      errors?: Record<string, string[]>;
    };
    if (body.message) return body.message;
    if (body.errors) {
      const first = Object.values(body.errors).flat()[0];
      if (first) return first;
    }
    if (body.title) return body.title;
  }
  return error.message || "Request failed";
}

// The AuthProvider keeps these in sync with the signed-in user
let authToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // An expired or invalid token: sign the user out instead of failing silently
    if (error.response?.status === 401 && authToken && onUnauthorized) {
      onUnauthorized();
      return Promise.reject(new Error("Your session has expired. Please sign in again."));
    }
    return Promise.reject(new Error(extractMessage(error)));
  },
);

export const http = {
  get: async <T>(path: string): Promise<T> => {
    const response = await api.get<T>(path);
    return response.data;
  },
  post: async <T>(path: string, body: unknown): Promise<T> => {
    const response = await api.post<T>(path, body);
    return response.data;
  },
  put: async <T>(path: string, body: unknown): Promise<T> => {
    const response = await api.put<T>(path, body);
    return response.data;
  },
  remove: async <T>(path: string): Promise<T> => {
    const response = await api.delete<T>(path);
    return response.data;
  },
};
