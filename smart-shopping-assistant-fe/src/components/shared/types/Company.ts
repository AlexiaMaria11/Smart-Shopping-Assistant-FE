import {
  CompanyStatus,
  type CompanyModel,
} from "../../../api/models/CompanyModel";

export { CompanyStatus };

export interface Company {
  id: number;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  contactEmail: string;
  website: string;
  status: CompanyStatus;
  commissionPercent: number;
  createdAt: Date;
  productCount: number;
}

export function toCompany(dto: CompanyModel): Company {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    description: dto.description ?? "",
    logoUrl: dto.logoUrl ?? "",
    bannerUrl: dto.bannerUrl ?? "",
    contactEmail: dto.contactEmail ?? "",
    website: dto.website ?? "",
    status: dto.status,
    commissionPercent: dto.commissionPercent,
    createdAt: new Date(dto.createdAt),
    productCount: dto.productCount,
  };
}

export const COMPANY_STATUS_LABELS: Record<CompanyStatus, string> = {
  [CompanyStatus.Pending]: "Pending",
  [CompanyStatus.Approved]: "Approved",
  [CompanyStatus.Rejected]: "Rejected",
  [CompanyStatus.Suspended]: "Suspended",
};
