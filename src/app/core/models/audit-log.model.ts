export interface AuditLog {
  id: number;
  ticketId?: number;
  assetId?: number;
  oldStatus: string;
  newStatus: string;
  changedAt: string;
  userId: number;
}