export type TaskType =
  | 'SYNC_TENDERS'
  | 'PROCESS_TENDER'
  | 'SEARCH_SUPPLIERS'
  | 'SEND_COMMUNICATIONS'
  | 'PARSE_CP'
  | 'NEGOTIATE';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface Task {
  id: string;
  task_type: TaskType;
  status: TaskStatus;
  progress_percent: number;
  entity_type: string;
  entity_id: string;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  result: any;
}