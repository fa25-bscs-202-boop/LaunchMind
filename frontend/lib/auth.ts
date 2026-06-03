import { apiRequest } from "./api";

const TOKEN_KEY = "launchmind_token";
const GUEST_TOKEN = "launchmind_guest";

const guestUser: User = {
  id: 0,
  name: "Guest",
  email: "guest@launchmind.local",
  created_at: new Date(0).toISOString(),
};

export type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

type AuthResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

type RegisterResponse = {
  message: string;
  email: string;
};

type MessageResponse = {
  message: string;
};

export function saveToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  if (typeof window === "undefined") {
    return GUEST_TOKEN;
  }

  return localStorage.getItem(TOKEN_KEY) || GUEST_TOKEN;
}

export function logoutUser() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
) {
  return apiRequest<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function verifyEmail(email: string, code: string) {
  return apiRequest<MessageResponse>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export async function resendVerificationCode(email: string) {
  return apiRequest<MessageResponse>("/auth/resend-code", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function loginUser(email: string, password: string) {
  const response = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  saveToken(response.access_token);
  return response;
}

export async function getCurrentUser() {
  try {
    return await apiRequest<User>("/auth/me", {
      method: "GET",
    });
  } catch {
    return guestUser;
  }
}
