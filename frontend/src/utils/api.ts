export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface User {
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

const API_BASE_URL = "/api";
const BACKEND_URL = "http://localhost:3001";

export const getImageUrl = (filename: string): string => {
  // If the filename is already a full URL (legacy), return it as-is
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename;
  }
  
  // All other files are S3 files - use the backend proxy
  return `${BACKEND_URL}/s3-images/${filename}`;
};

export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

export const setAuthToken = (token: string) => {
  localStorage.setItem("authToken", token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem("authToken");
};

export const clearAuthToken = (): void => {
  localStorage.removeItem("authToken");
};

export const checkHealth = async (): Promise<ApiResponse<unknown>> => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
};

export const loginUser = async (
  credentials: LoginRequest
): Promise<ApiResponse<LoginData>> => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

export const registerUser = async (
  userData: RegisterRequest
): Promise<ApiResponse<LoginData>> => {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};

// Helper function for authenticated requests
const makeAuthenticatedRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
};

// Get current user profile
export const getCurrentUserProfile = async (): Promise<
  ApiResponse<{ user: User }>
> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/users/profile`
  );
  return response.json();
};

// Update user profile (protected)
export const updateUserProfile = async (
  profileData: UpdateProfileRequest
): Promise<ApiResponse<any>> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/users/profile`,
    {
      method: "PUT",
      body: JSON.stringify(profileData),
    }
  );
  return response.json();
};

// Change password (protected)
export const changePassword = async (
  passwordData: ChangePasswordRequest
): Promise<ApiResponse<any>> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/users/change-password`,
    {
      method: "PUT",
      body: JSON.stringify(passwordData),
    }
  );
  return response.json();
};

// Get public user profile by ID (no auth needed)
export const getUserProfile = async (
  userId: number
): Promise<ApiResponse<{ user: User }>> => {
  const response = await fetch(`${API_BASE_URL}/users/users/${userId}`);
  return response.json();
};

// Delete user account (protected)
export const deleteUserAccount = async (): Promise<ApiResponse<any>> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/users/profile`,
    {
      method: "DELETE",
    }
  );
  return response.json();
};

export interface Post {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
  seller_id: number;
  university: string;
  images: string[];
  views: number;
  status: string;
  contact_method?: string;
  course?: string;
  event?: string;
  location?: string;
  created_at: string;
  updated_at: string;
  seller_name?: string;
  seller_email?: string;
  seller_phone?: string;
}

export interface CreatePostRequest {
  title: string;
  description: string;
  price: number;
  category: string;
  contactMethod?: string;
  course?: string;
  event?: string;
  location?: string;
}

export interface PostsResponse {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

export const getAllPosts = async (params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
}): Promise<ApiResponse<PostsResponse>> => {
  const queryParams = new URLSearchParams();
  if (params?.category) queryParams.append("category", params.category);
  if (params?.search) queryParams.append("search", params.search);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.status) queryParams.append("status", params.status);

  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/posts?${queryParams.toString()}`
  );
  return response.json();
};

export const getPostById = async (
  postId: number
): Promise<ApiResponse<{ post: Post }>> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
  return response.json();
};

export const createPost = async (
  postData: CreatePostRequest,
  images?: File[]
): Promise<ApiResponse<{ post: Post }>> => {
  try {
    // Create FormData to send all data including images in one request
    const formData = new FormData();

    // Add post data to FormData
    formData.append("title", postData.title);
    formData.append("description", postData.description);
    formData.append("price", postData.price.toString());
    formData.append("category", postData.category);

    // Add optional fields if they exist
    if (postData.contactMethod) {
      formData.append("contactMethod", postData.contactMethod);
    }
    if (postData.course) {
      formData.append("course", postData.course);
    }
    if (postData.event) {
      formData.append("event", postData.event);
    }
    if (postData.location) {
      formData.append("location", postData.location);
    }

    // Add images if they exist
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    // Make the request with FormData (no Content-Type header - browser will set it)
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const result = await response.json();

    if (result.success && result.data?.post) {
      return {
        data: { post: result.data.post },
        message: result.message || "Post created successfully",
      };
    } else {
      return {
        data: { post: {} as Post },
        error: result.message || "Failed to create post",
      };
    }
  } catch (error) {
    console.error("Create post error:", error);
    return {
      data: { post: {} as Post },
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const updatePost = async (
  postId: number,
  postData: Partial<CreatePostRequest>
): Promise<ApiResponse<{ post: Post }>> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/posts/${postId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    }
  );
  return response.json();
};

export const deletePost = async (postId: number): Promise<ApiResponse<any>> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/posts/${postId}`,
    {
      method: "DELETE",
    }
  );
  return response.json();
};

export const markPostAsSold = async (
  postId: number
): Promise<ApiResponse<{ post: Post }>> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/posts/${postId}/sold`,
    {
      method: "PATCH",
    }
  );
  return response.json();
};

export const getUserPosts = async (
  userId: number
): Promise<ApiResponse<{ posts: Post[] }>> => {
  const response = await fetch(`${API_BASE_URL}/posts/user/${userId}`);
  return response.json();
};
