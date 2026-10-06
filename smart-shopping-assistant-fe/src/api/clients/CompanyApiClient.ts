import { toCompany, type Company } from "../../components/shared/types/Company";
import { http } from "../base/http";
import type {
  CompanyInput,
  CompanyModel,
  CompanyStatusInput,
} from "../models/CompanyModel";

export const companiesApi = {
  getAll: async (includeAll = false): Promise<Company[]> => {
    const data = await http.get<CompanyModel[]>(
      includeAll ? "/companies/all" : "/companies",
    );
    return data.map(toCompany);
  },
  getMine: async (): Promise<Company> => {
    return toCompany(await http.get<CompanyModel>("/companies/mine"));
  },
  getById: async (id: number): Promise<Company> => {
    return toCompany(await http.get<CompanyModel>(`/companies/${id}`));
  },
  getBySlug: async (slug: string): Promise<Company> => {
    return toCompany(await http.get<CompanyModel>(`/companies/slug/${slug}`));
  },
  create: async (data: CompanyInput): Promise<Company> => {
    return toCompany(await http.post<CompanyModel>("/companies", data));
  },
  update: async (id: number, data: CompanyInput): Promise<Company> => {
    return toCompany(await http.put<CompanyModel>(`/companies/${id}`, data));
  },
  updateStatus: async (id: number, data: CompanyStatusInput): Promise<Company> => {
    return toCompany(
      await http.put<CompanyModel>(`/companies/${id}/status`, data),
    );
  },
  remove: (id: number): Promise<void> => {
    return http.remove(`/companies/${id}`);
  },
};
