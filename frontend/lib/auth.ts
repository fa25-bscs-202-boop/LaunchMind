import { apiRequest } from "./api";

const TOKEN_KEY = "launchmind_token";
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
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function hasStoredUserToken() {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(localStorage.getItem(TOKEN_KEY));
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
  return apiRequest<User>("/auth/me", {
    method: "GET",
  });
}

export async function forgotPassword(email: string) {
  return apiRequest<MessageResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(email: string, code: string, newPassword: string) {
  return apiRequest<MessageResponse>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, code, new_password: newPassword }),
  });
}
