// Pagination Metadata
export interface PaginationMetadata {
  total_items: number; // Total number of items
  total_pages: number; // Total number of pages
  current_page: number; // Current page number
  page_size: number; // Number of items per page
  has_next: boolean; // Whether there are more pages
  has_previous: boolean; // Whether there are previous pages
}

// Error Models
export enum ErrorCode {
  NOT_FOUND = "not_found",
  VALIDATION_ERROR = "validation_error",
  INTERNAL_SERVER_ERROR = "internal_server_error",
}

export interface ErrorResponse {
  code: ErrorCode;
  message: string;
  details?: object[]; // Optional list of additional error details
}

// Generic API Response
export interface APIResponse<T> {
  success: boolean; // Indicates if the request was successful
  data?: T; // Response payload
  error?: ErrorResponse; // Error details if request failed
  pagination?: PaginationMetadata; // Pagination metadata for list responses
}

// Task-Related Models
export interface TaskResponseSchema {
  id: number;
  title: string;
  description?: string;
  status: string;
  created_at: string; // ISO string for datetime
  updated_at?: string; // Optional ISO string for datetime
}

export interface TaskBase {
  title: string; // Task title
  description?: string; // Optional task description
  status: TaskStatusEnum; // Task status
}

export enum TaskStatusEnum {
  PENDING = "pending",
  COMPLETED = "completed",
}

export type TaskCreate = TaskBase;

export interface TaskUpdate {
  title?: string; // Optional to allow partial updates
  description?: string; // Optional task description
  is_deleted?: boolean; // Mark task as deleted
  status?: TaskStatusEnum; // Update task status
}

export interface TasksBulkAction {
  task_ids: number[]; // List of task IDs to be acted upon
}

export interface TaskStatisticSchema {
  id: number;
  task_id: number;
  action: TaskActionEnum;
  actionAt: string; // ISO string for datetime
}

export enum TaskActionEnum {
  CREATED = "created",
  UPDATED = "updated",
  DELETED = "deleted",
  COMPLETED = "completed",
}

export interface TaskStatisticsOverviewSchema {
  total_tasks: number; // Total number of tasks
  modified_tasks: number; // Number of modified tasks
  deleted_tasks: number; // Number of deleted tasks
  completed_tasks: number; // Number of completed tasks
}
