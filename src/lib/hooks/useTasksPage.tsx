import { useState, useCallback, useEffect } from "react";
import {
  useGetTasksQuery,
  useBulkUpdateTasksMutation,
} from "@/lib/redux/features/api/apiSlice";
import { TaskResponseSchema } from "@/lib/types/api.types";

export const useTasksPage = () => {
  const [page, setPage] = useState(1);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<
    TaskResponseSchema | undefined
  >(undefined);

  const { data, error, isLoading, isFetching, isSuccess, originalArgs } =
    useGetTasksQuery(
      { page, limit: 10 },
      {
        selectFromResult: ({ data, ...rest }) => ({
          ...rest,
          data: data?.data || [],
          pagination: data?.pagination,
        }),
      },
    );

  const [bulkUpdateTasks] = useBulkUpdateTasksMutation();

  // Infinite scroll handler
  const handleLoadMore = useCallback(() => {
    if (originalArgs?.pagination?.has_next && !isFetching) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [originalArgs?.pagination?.has_next, isFetching]);

  // Task selection methods
  const toggleSelectMode = useCallback(() => {
    setIsSelectMode((prev) => !prev);
    setSelectedTasks([]);
  }, []);

  const handleTaskSelect = useCallback((taskId: number) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  }, []);

  // Modal handling methods
  const openTaskModal = useCallback((task?: TaskResponseSchema) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  }, []);

  const closeTaskModal = useCallback(() => {
    setIsTaskModalOpen(false);
    setSelectedTask(undefined);
  }, []);

  // Bulk action methods
  const handleDeleteSelected = useCallback(async () => {
    try {
      await bulkUpdateTasks({
        action: "delete",
        taskIds: selectedTasks,
      }).unwrap();
      setSelectedTasks([]);
      setIsSelectMode(false);
    } catch (error) {
      console.error("Failed to delete tasks", error);
    }
  }, [bulkUpdateTasks, selectedTasks]);

  const handleMarkSelectedComplete = useCallback(async () => {
    try {
      await bulkUpdateTasks({
        action: "complete",
        taskIds: selectedTasks,
      }).unwrap();
      setSelectedTasks([]);
      setIsSelectMode(false);
    } catch (error) {
      console.error("Failed to complete tasks", error);
    }
  }, [bulkUpdateTasks, selectedTasks]);

  // Reset page when selecting mode changes
  useEffect(() => {
    setPage(1);
  }, [isSelectMode]);

  return {
    // State
    data,
    error,
    isLoading,
    isFetching,
    isSuccess,
    isSelectMode,
    selectedTasks,
    isTaskModalOpen,
    selectedTask,
    pagination: originalArgs?.pagination,

    // Methods
    toggleSelectMode,
    handleTaskSelect,
    openTaskModal,
    closeTaskModal,
    handleDeleteSelected,
    handleMarkSelectedComplete,
    handleLoadMore,
  };
};
