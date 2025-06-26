export interface Hiring {
  id: string;
  team: string;
  requisitionType?: string;
  sharepointId?: string;
  incrementalType?: string;
  skills: string[];
  experienceLevel?: string;
  candidateName: string;
  remarks?: string;
  status: string;
  vendor?: string;
  hiringManager: string;
  updatedBy?: string;
  createdBy?: string;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
}