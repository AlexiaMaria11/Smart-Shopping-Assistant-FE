import { http } from "../base/http";
import type {
  AuthResponseModel,
  LoginInput,
  RegisterInput,
  SellerRegisterInput,
  UserModel,
} from "../models/AuthModel";

export const authApi = {
  login: (data: LoginInput) =>
    http.post<AuthResponseModel>("/auth/login", data),
  register: (data: RegisterInput) =>
    http.post<AuthResponseModel>("/auth/register", data),
  registerSeller: (data: SellerRegisterInput) =>
    http.post<AuthResponseModel>("/auth/register-seller", data),
  me: () => http.get<UserModel>("/auth/me"),
};
