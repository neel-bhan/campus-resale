export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface User{
    id: number;
    email: string;
    name: string;
    role: string;
    university?: string;
    phone?: string;
    createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  token: string;
  user: User;
}

const API_BASE_URL = '/api';

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = (): void => {
    localStorage.removeItem('authToken');
};

export const checkHealth = async (): Promise<ApiResponse<unknown>> => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
};

export const loginUser = async (credentials: LoginRequest): Promise<ApiResponse<LoginData>> => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    return response.json();
};

export const registerUser = async (userData: RegisterRequest): Promise<ApiResponse<LoginData>> => {
    const response = await fetch(`${API_BASE_URL}/register`,
        {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(userData),

        }
    );
    return response.json();
};