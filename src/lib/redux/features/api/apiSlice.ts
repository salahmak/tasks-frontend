"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  APIResponse,
  TaskResponseSchema,
  TaskCreate,
  TaskUpdate,
  TaskStatisticsOverviewSchema,
} from "@/lib/types/api.types";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/v1" }),
  tagTypes: ["Tasks", "Statistics"],
  endpoints: (builder) => ({
    getTasks: builder.query<APIResponse<TaskResponseSchema[]>, void>({
      query: () => `/tasks`,
      providesTags: ["Tasks"],
    }),

    addTask: builder.mutation<APIResponse<TaskResponseSchema>, TaskCreate>({
      query: (task) => ({
        url: "/tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),

    updateTask: builder.mutation<
      APIResponse<TaskResponseSchema>,
      { id: number; task: TaskUpdate }
    >({
      query: ({ id, task }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),

    deleteTask: builder.mutation<APIResponse<void>, number>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),

    bulkUpdateTasks: builder.mutation<
      APIResponse<void>,
      {
        action: "complete" | "delete";
        taskIds: number[];
      }
    >({
      query: ({ action, taskIds }) => ({
        url: `/tasks/bulk-${action}`,
        method: "PATCH",
        body: { task_ids: taskIds },
      }),
      invalidatesTags: ["Tasks"],
    }),

    getTaskStatistics: builder.query<
      APIResponse<TaskStatisticsOverviewSchema>,
      void
    >({
      query: () => `/statistics`,
      providesTags: ["Statistics", "Tasks"], // Invalidate when tasks change
    }),
  }),
});

export const {
  useGetTasksQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useBulkUpdateTasksMutation,
  useGetTaskStatisticsQuery,
} = apiSlice;
