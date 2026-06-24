import { IBaseEntity } from "@/interfaces/common.interface";

export interface IUser extends IBaseEntity {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  avatar?: string;
}

export interface IAuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface IAuthActions {
  login: (email: string, name: string) => void;
  signup: (email: string, name: string) => void;
  logout: () => void;
}
