// Common API response wrapper
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  statusCode: number;
}

// Pagination response
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error response
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  details?: any;
}

// Auth types
export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  refresh_token: string;
  user_id: string;
  // expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// User types
export interface User {
  id: string;
  person_id?: string;
  email: string;
  first_name: string;
  last_name: string;
  image_url?: string;
  role: string;
  mobile_number?: string;
  country_code?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user_type?: string; // Added based on usage in BhaktiGeet.tsx
}

export interface UserProfile extends User {
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: Address;
  preferences?: UserPreferences;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UserPreferences {
  language: string;
  theme: "light" | "dark" | "system";
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: Partial<Address>;
  preferences?: Partial<UserPreferences>;
}

// Family tree specific types (examples based on your app context)
export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  relation: string;
  dateOfBirth?: string;
  dateOfDeath?: string;
  spouse?: FamilyMember;
  children?: FamilyMember[];
  parents?: FamilyMember[];
}

export interface FamilyTree {
  id: string;
  name: string;
  description?: string;
  rootMember: FamilyMember;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Business directory types (based on your pages)
export interface BusinessProfile {
  id: string;
  name: string;
  description?: string;
  category: string;
  owner: User;
  contact: {
    email: string;
    phone: string;
    website?: string;
    address: Address;
  };
  images?: string[];
  isVerified: boolean;
  rating?: number;
  reviews?: BusinessReview[];
  createdAt: string;
  updatedAt: string;
}

export interface BusinessReview {
  id: string;
  rating: number;
  comment: string;
  reviewer: User;
  createdAt: string;
}

// Common request types
export interface SearchRequest {
  query: string;
  page?: number;
  limit?: number;
  filters?: Record<string, any>;
}

export interface IdParams {
  id: string;
}
