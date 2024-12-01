// Pagination Metadata
export interface PaginationMetadata {
  totalItems: number; // Total number of items
  totalPages: number; // Total number of pages
  currentPage: number; // Current page number
  pageSize: number; // Number of items per page
  hasNext: boolean; // Whether there are more pages
  hasPrevious: boolean; // Whether there are previous pages
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
  createdAt: string; // ISO string for datetime
  updatedAt?: string; // Optional ISO string for datetime
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
  isDeleted?: boolean; // Mark task as deleted
  status?: TaskStatusEnum; // Update task status
}

export interface TasksBulkAction {
  taskIds: number[]; // List of task IDs to be acted upon
}

export interface TaskSchema extends TaskBase {
  id: number;
  createdAt: string; // ISO string for datetime
  updatedAt?: string; // Optional ISO string for datetime
  isDeleted: boolean; // Default value is false
}

export interface TaskStatisticSchema {
  id: number;
  taskId: number;
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
  totalTasks: number; // Total number of tasks
  modifiedTasks: number; // Number of modified tasks
  deletedTasks: number; // Number of deleted tasks
  completedTasks: number; // Number of completed tasks
}
