export const CompanyStatus = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
  Suspended: 3,
} as const;
export type CompanyStatus = (typeof CompanyStatus)[keyof typeof CompanyStatus];

export interface CompanyModel {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  contactEmail?: string;
  website?: string;
  status: CompanyStatus;
  commissionPercent: number;
  createdAt: string;
  productCount: number;
}

export interface CompanyInput {
  name: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  contactEmail?: string;
  website?: string;
}

export interface CompanyStatusInput {
  status: CompanyStatus;
  commissionPercent: number;
}
