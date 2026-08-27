export interface APIResponse<T> {
  data: T;
  meta?: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}