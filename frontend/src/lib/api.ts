export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("stockmate_token");
};

export const apiGet = async <T>(path: string): Promise<ApiResponse<T>> => {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { method: "GET", headers });
  return res.json();
};

export const apiPost = async <T>(path: string, body: unknown): Promise<ApiResponse<T>> => {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return res.json();
};

export const apiPatch = async <T>(path: string, body: unknown): Promise<ApiResponse<T>> => {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
  return res.json();
};

export const apiDelete = async <T>(path: string): Promise<ApiResponse<T>> => {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { method: "DELETE", headers });
  return res.json();
};

export interface AuthData {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

export const login = async (email: string, password: string): Promise<ApiResponse<AuthData>> => {
  return apiPost("/auth/login", { email, password });
};

export const register = async (email: string, password: string): Promise<ApiResponse<AuthData>> => {
  return apiPost("/auth/register", { email, password });
};