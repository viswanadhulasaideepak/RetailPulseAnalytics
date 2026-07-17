export interface AuditLog {
  id: number;
  company_id: number | null;
  user_id: number | null;

  action: string;
  ip_address: string | null;
  browser: string | null;

  created_at: string;

  user_name: string | null;
  user_email: string | null;
}