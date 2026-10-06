import { Role } from "../../api/models/AuthModel";

// Where each kind of user lands after signing in
export function homeForRole(role: Role): string {
  if (role === Role.Admin) return "/admin/companies";
  if (role === Role.Seller) return "/seller/store";
  return "/shop";
}
