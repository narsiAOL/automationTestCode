// HTTP Client
export { default as httpClient } from "./http";
export type {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "./http";

// Services
export { default as authService } from "./auth";
export { default as userService } from "./user";
export * as relationshipService from "./relationshipService";

// Types
export type * from "./types";

// Re-export commonly used types for convenience
export type {
  ApiResponse,
  PaginatedResponse,
  ApiError,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
  UserProfile,
  UpdateUserRequest,
  FamilyMember,
  FamilyTree,
  BusinessProfile,
  BusinessReview,
  SearchRequest,
} from "./types";
