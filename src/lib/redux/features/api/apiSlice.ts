"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  APIResponse,
  TaskResponseSchema,
  TaskCreate,
  TaskUpdate,
  TaskStatisticsOverviewSchema,
} from "@/lib/types/api.types";
import { getApiEndpoint } from "@/lib/env";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: getApiEndpoint() }),
  tagTypes: ["Tasks", "Statistics"],
  endpoints: (builder) => ({
    getTasks: builder.query<
      APIResponse<TaskResponseSchema[]>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => `/tasks?page=${page}&limit=${limit}`,
      // Merge incoming results with existing data for infinite scroll
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Combine paginated results
      merge: (currentCache, newItems) => {
        // Ensure no duplicates
        if (newItems.data) {
          const existingIds = new Set(
            currentCache.data?.map((task) => task.id) || [],
          );
          const uniqueNewItems = newItems.data.filter(
            (task) => !existingIds.has(task.id),
          );

          currentCache.data = [...(currentCache.data || []), ...uniqueNewItems];
          currentCache.pagination = newItems.pagination;
        }
      },
      // Prevent refetching the same data
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
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
