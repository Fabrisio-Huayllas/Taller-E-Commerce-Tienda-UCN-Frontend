import type {
  RegisterFormData,
  RegisterResponse,
  VerifyEmailData,
  VerifyEmailResponse,
  ResendCodeData,
  ResendCodeResponse,
} from "@/types/register";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5043/api";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  console.log("📡 Response status:", response.status);
  console.log("📡 Response URL:", response.url);

  const contentType = response.headers.get("content-type");
  console.log("📡 Content-Type:", contentType);

  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    console.error("❌ Response no es JSON:", text);
    throw new ApiError(
      response.status,
      `Error del servidor (${response.status})`,
    );
  }

  const data = await response.json();
  console.log("📡 Response data:", data);

  if (!response.ok) {
    const errorMessage = data.message || data.title || "Error en la solicitud";
    throw new ApiError(response.status, errorMessage, data.errors);
  }

  return data;
}

// ⭐ Interfaces para Login
export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  userId: number;
}

export const authService = {
  // ⭐ MÉTODO LOGIN (NUEVO)
  async login(data: LoginData): Promise<LoginResponse> {
    const url = `${API_URL}/auth/login`;
    console.log("🚀 Enviando login a:", url);
    console.log("📦 Payload:", { email: data.email, password: "***" });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      return handleResponse<LoginResponse>(response);
    } catch (error) {
      console.error("❌ Error en login:", error);
      throw error;
    }
  },

  // ⭐ MÉTODO isTokenValid (NUEVO)
  isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000; // Convertir a milisegundos
      return Date.now() < exp;
    } catch {
      return false;
    }
  },

  async register(data: RegisterFormData): Promise<RegisterResponse> {
    const url = `${API_URL}/auth/register`;
    console.log("🚀 Enviando registro a:", url);
    console.log("📦 Payload:", JSON.stringify(data, null, 2));

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          rut: data.rut,
          firstName: data.firstName,
          lastName: data.lastName,
          birthDate: data.birthDate,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
        }),
      });

      return handleResponse<RegisterResponse>(response);
    } catch (error) {
      console.error("❌ Error en fetch:", error);
      throw error;
    }
  },

  async verifyEmail(data: VerifyEmailData): Promise<VerifyEmailResponse> {
    const url = `${API_URL}/auth/verify-email`;
    console.log("🚀 Enviando verificación a:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        verificationCode: data.verificationCode,
      }),
    });

    return handleResponse<VerifyEmailResponse>(response);
  },

  async resendVerificationCode(
    data: ResendCodeData,
  ): Promise<ResendCodeResponse> {
    const url = `${API_URL}/auth/resend-email-verification-code`;
    console.log("🚀 Reenviando código a:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return handleResponse<ResendCodeResponse>(response);
  },
};
