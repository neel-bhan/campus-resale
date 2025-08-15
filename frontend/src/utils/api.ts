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
  university?: string;
}

export interface LoginData {
  token: string;
  user: User;
}

export interface UpdateProfileRequest {
  name?: string;
  university?: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
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

export const clearAuthToken = (): void => {
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
    const response = await fetch(`${API_BASE_URL}/users/register`,
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

// Helper function for authenticated requests
const makeAuthenticatedRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
};

// Get current user profile
export const getCurrentUserProfile = async (): Promise<ApiResponse<{ user: User }>> => {
  const response = await makeAuthenticatedRequest(`${API_BASE_URL}/users/profile`);
  return response.json();
};

// Update user profile (protected)
export const updateUserProfile = async (profileData: UpdateProfileRequest): Promise<ApiResponse<any>> => {
  const response = await makeAuthenticatedRequest(`${API_BASE_URL}/users/profile`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
  return response.json();
};

// Change password (protected)
export const changePassword = async (passwordData: ChangePasswordRequest): Promise<ApiResponse<any>> => {
  const response = await makeAuthenticatedRequest(`${API_BASE_URL}/users/change-password`, {
    method: 'PUT',
    body: JSON.stringify(passwordData),
  });
  return response.json();
};

// Get public user profile by ID (no auth needed)
export const getUserProfile = async (userId: number): Promise<ApiResponse<{ user: User }>> => {
  const response = await fetch(`${API_BASE_URL}/users/users/${userId}`);
  return response.json();
};

// Delete user account (protected)
export const deleteUserAccount = async (): Promise<ApiResponse<any>> => {
  const response = await makeAuthenticatedRequest(`${API_BASE_URL}/users/profile`, {
    method: 'DELETE',
  });
  return response.json();
};

