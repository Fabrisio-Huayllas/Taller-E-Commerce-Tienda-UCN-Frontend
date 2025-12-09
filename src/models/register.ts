export interface RegisterFormData {
  firstName: string;
  lastName: string;
  rut: string;
  gender: "Masculino" | "Femenino" | "Otro";
  birthDate: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: string;
}

export interface VerifyEmailData {
  email: string;
  verificationCode: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  data: string;
}

export interface ResendCodeData {
  email: string;
}

export interface ResendCodeResponse {
  success: boolean;
  message: string;
  data: string;
}

export interface ApiErrorResponse {
  type: string;
  title: string;
  status: number;
  errors?: Record<string, string[]>;
  traceId?: string;
}
