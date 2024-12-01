"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import {
  useGetTasksQuery,
  useBulkUpdateTasksMutation,
} from "@/lib/redux/features/api/apiSlice";
import { TaskResponseSchema } from "@/lib/types/api.types";
import TaskTile from "./components/tasks/TaskTile";
import TaskModal from "./components/tasks/TaskModal";

const TasksPage = () => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, isFetching, isSuccess } = useGetTasksQuery({
    page,
    limit: 10,
  });

  const [bulkUpdateTasks] = useBulkUpdateTasksMutation();
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<
    TaskResponseSchema | undefined
  >(undefined);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    // Check if we've scrolled to the bottom of the page
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight &&
      data?.pagination?.has_next &&
      !isFetching
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [data?.pagination?.has_next, isFetching]);

  // Add and remove scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedTasks([]);
  };

  const handleTaskSelect = (taskId: number) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  };

  const handleOpenTaskModal = (task?: TaskResponseSchema) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteSelected = async () => {
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
  };

  const handleMarkSelectedComplete = async () => {
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
  };

  let content;

  if (isLoading && page === 1) {
    content = <Typography>Loading...</Typography>;
  } else if (isSuccess && data?.data) {
    content = (
      <Box>
        {data.data.map((task: TaskResponseSchema) => (
          <TaskTile
            key={task.id}
            task={task}
            isSelectMode={isSelectMode}
            isSelected={selectedTasks.includes(task.id)}
            onSelect={() => handleTaskSelect(task.id)}
            onEdit={() => handleOpenTaskModal(task)}
          />
        ))}

        {/* Loading indicator at the bottom */}
        {isFetching && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              my: 2,
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}

        {/* No more tasks indicator */}
        {!data?.pagination?.has_next && (
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ my: 2 }}
          >
            No more tasks
          </Typography>
        )}
      </Box>
    );
  } else if (error) {
    content = <Typography color="error">Error loading tasks</Typography>;
  } else {
    content = <Typography>No tasks found</Typography>;
  }

  return (
    <PageContainer title="Tasks" description="Manage your tasks">
      <DashboardCard title="Tasks">
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Button
              variant={isSelectMode ? "contained" : "outlined"}
              onClick={handleSelectMode}
            >
              {isSelectMode ? "Cancel" : "Select Tasks"}
            </Button>

            {isSelectMode && (
              <>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteSelected}
                  disabled={selectedTasks.length === 0}
                >
                  Delete Selected
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  onClick={handleMarkSelectedComplete}
                  disabled={selectedTasks.length === 0}
                >
                  Mark Selected Complete
                </Button>
              </>
            )}

            <IconButton
              color="primary"
              onClick={() => handleOpenTaskModal()}
              sx={{ ml: "auto" }}
            >
              <AddIcon />
            </IconButton>
          </Box>

          {content}

          <TaskModal
            open={isTaskModalOpen}
            onClose={() => {
              setIsTaskModalOpen(false);
              setSelectedTask(undefined);
            }}
            task={selectedTask}
          />
        </>
      </DashboardCard>
    </PageContainer>
  );
};

export default TasksPage;
