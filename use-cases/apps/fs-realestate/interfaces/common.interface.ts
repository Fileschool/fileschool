export interface IBaseEntity {
  id: string;
  createdAt: number;
  updatedAt?: number;
}

export interface IApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
