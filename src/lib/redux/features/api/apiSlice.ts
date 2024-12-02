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

    getTask: builder.query<APIResponse<TaskResponseSchema>, number>({
      query: (id) => `/tasks/${id}`,
      providesTags: (result, error, id) => [{ type: "Tasks", id }],
    }),

    addTask: builder.mutation<APIResponse<TaskResponseSchema>, TaskCreate>({
      query: (task) => ({
        url: "/tasks",
        method: "POST",
        body: task,
      }),
      async onQueryStarted(task, { dispatch, queryFulfilled }) {
        try {
          const { data: newTask } = await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData(
              "getTasks",
              { page: 1, limit: 10 },
              (draft) => {
                if (draft.data) {
                  draft.data.unshift(newTask.data);
                }
              },
            ),
          );
        } catch {}
      },
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
      async onQueryStarted({ id, task }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedTask } = await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData(
              "getTasks",
              { page: 1, limit: 10 },
              (draft) => {
                if (draft.data) {
                  const index = draft.data.findIndex((t) => t.id === id);
                  if (index !== -1) {
                    draft.data[index] = updatedTask.data;
                  }
                }
              },
            ),
          );
        } catch {}
      },
    }),

    deleteTask: builder.mutation<APIResponse<void>, number>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const deleteResult = dispatch(
          apiSlice.util.updateQueryData(
            "getTasks",
            { page: 1, limit: 10 },
            (draft) => {
              if (draft.data) {
                draft.data = draft.data.filter((task) => task.id !== id);
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          deleteResult.undo();
        }
      },
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
      async onQueryStarted({ action, taskIds }, { dispatch, queryFulfilled }) {
        if (action === "delete") {
          const deleteResult = dispatch(
            apiSlice.util.updateQueryData(
              "getTasks",
              { page: 1, limit: 10 },
              (draft) => {
                if (draft.data) {
                  draft.data = draft.data.filter(
                    (task) => !taskIds.includes(task.id),
                  );
                }
              },
            ),
          );
          try {
            await queryFulfilled;
          } catch {
            deleteResult.undo();
          }
        }
      },
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
