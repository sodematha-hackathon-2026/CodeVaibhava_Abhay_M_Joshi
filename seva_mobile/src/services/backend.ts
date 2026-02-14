import auth from "@react-native-firebase/auth";

export const BASE_URL = process.env.EXPO_PUBLIC_API_BASE || "http://10.0.2.2:8080";
export async function api<T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
): Promise<T> {
  const u = auth().currentUser;
  if (!u) throw new Error("Not logged in");

  const token = await u.getIdToken(true);

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || "API failed");
  return text ? (JSON.parse(text) as T) : ({} as T);
}
export async function apiPublic<T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || "API failed");
  return text ? (JSON.parse(text) as T) : ({} as T);
}
