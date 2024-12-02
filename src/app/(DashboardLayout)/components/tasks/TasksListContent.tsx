import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { APIResponse, TaskResponseSchema } from "@/lib/types/api.types";
import TaskTile from "./TaskTile";

interface TasksListContentProps {
  data?: APIResponse<TaskResponseSchema[]>;
  error?: any;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isSelectMode: boolean;
  selectedTasks: number[];
  handleTaskSelect: (taskId: number) => void;
  openTaskModal: (task?: TaskResponseSchema) => void;
}

const TasksListContent: React.FC<TasksListContentProps> = ({
  data,
  error,
  isLoading,
  isFetching,
  isSuccess,
  isSelectMode,
  selectedTasks,
  handleTaskSelect,
  openTaskModal,
}) => {
  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error loading tasks</Typography>;
  }

  if (!isSuccess || !data?.data || data.data.length === 0) {
    return <Typography>No tasks found</Typography>;
  }

  return (
    <Box>
      {data.data.map((task: TaskResponseSchema) => (
        <TaskTile
          key={task.id}
          task={task}
          isSelectMode={isSelectMode}
          isSelected={selectedTasks.includes(task.id)}
          onSelect={() => handleTaskSelect(task.id)}
          onEdit={() => openTaskModal(task)}
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
};

export default TasksListContent;
