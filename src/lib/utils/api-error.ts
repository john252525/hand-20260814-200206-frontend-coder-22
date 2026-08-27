import { AxiosError } from 'axios';
import { toast } from 'sonner';

export class APIError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown): never {
  if (error instanceof AxiosError) {
    const status = error.response?.status || 500;
    const data = error.response?.data as any;
    const message = data?.error?.message || data?.message || 'Произошла ошибка';
    const code = data?.error?.code || 'INTERNAL_ERROR';
    const details = data?.error?.details;

    console.error(`API Error [${status}] ${code}: ${message}`, details);
    toast.error(message);

    throw new APIError(status, code, message, details);
  }

  if (error instanceof Error) {
    toast.error(error.message);
    throw error;
  }

  const message = 'Неизвестная ошибка';
  toast.error(message);
  throw new Error(message);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Произошла неизвестная ошибка';
}