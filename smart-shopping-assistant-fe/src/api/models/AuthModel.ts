import type { CompanyInput, CompanyStatus } from "./CompanyModel";

export const Role = {
  Admin: "Admin",
  Seller: "Seller",
  Customer: "Customer",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export interface UserModel {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  companyId?: number;
  companyName?: string;
  companyStatus?: CompanyStatus;
}

export interface AuthResponseModel {
  token: string;
  expiresAt: string;
  user: UserModel;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
}

export interface SellerRegisterInput extends RegisterInput {
  company: CompanyInput;
}
