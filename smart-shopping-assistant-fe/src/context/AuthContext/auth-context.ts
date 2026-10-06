import { createContext, useContext } from "react";
import type {
  LoginInput,
  RegisterInput,
  Role,
  SellerRegisterInput,
  UserModel,
} from "../../api/models/AuthModel";

export interface AuthContextValue {
  user: UserModel | null;
  isAuthenticated: boolean;
  // The page where the user pressed "Sign out" (null after an expired session)
  signedOutFrom: string | null;
  hasRole: (...roles: Role[]) => boolean;
  login: (data: LoginInput) => Promise<UserModel>;
  register: (data: RegisterInput) => Promise<UserModel>;
  registerSeller: (data: SellerRegisterInput) => Promise<UserModel>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
