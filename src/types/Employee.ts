export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  coreAlignment?: string | null;
  coreTeam?: string | null;
  secondaryTeam?: string | null;
  email?: string | null;
  contactNumber?: string | null;
  dateOfJoining?: string | Date | null;
  dateOfTermination?: string | Date | null;
  role?: string | null;
  status: "Open" | "Active" | "Term" | "Inactive";
  jobTitle?: string | null;
  roleType: "Engineering" | "NonEngineering" | "Both";
  baseLocation?: string | null;
  manager?: string | null;
  vendor?: string | null;
  skills: string[];
  updatedBy?: string;
  createdBy?: string;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
}