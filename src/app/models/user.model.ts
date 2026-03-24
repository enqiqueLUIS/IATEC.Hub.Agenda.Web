export interface User {
  id: number;
  email: string;
  name: string;
  password?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  token: string;
  userId: number;
  name: string;
  email: string;
  expiresAt: string;
}

export interface LoginResponse {
  data: LoginData;
  messages: { type: string; description: string }[];
}
