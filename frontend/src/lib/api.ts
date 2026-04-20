const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("stockmate_token");
};

export const apiGet = async <T>(path: string): Promise<any> => {
  const token = getToken();
  const headers: any = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { method: "GET", headers });
  return res.json();
};

export const apiPost = async <T>(path: string, body: any): Promise<any> => {
  const token = getToken();
  const headers: any = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return res.json();
};

export const apiPatch = async <T>(path: string, body: any): Promise<any> => {
  const token = getToken();
  const headers: any = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
  return res.json();
};

export const apiDelete = async <T>(path: string): Promise<any> => {
  const token = getToken();
  const headers: any = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { method: "DELETE", headers });
  return res.json();
};