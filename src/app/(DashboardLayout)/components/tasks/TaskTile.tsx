import React from "react";
import { Box, Typography, IconButton, Checkbox, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { TaskResponseSchema, TaskStatusEnum } from "@/lib/types/api.types";
import {
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "@/lib/redux/features/api/apiSlice";

interface TaskTileProps {
  task: TaskResponseSchema;
  isSelectMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

const TaskTile: React.FC<TaskTileProps> = ({
  task,
  isSelectMode,
  isSelected,
  onSelect,
  onEdit,
}) => {
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const isCompleted = task.status === TaskStatusEnum.COMPLETED;

  const handleToggleComplete = async () => {
    try {
      await updateTask({
        id: task.id,
        task: {
          status: isCompleted
            ? TaskStatusEnum.PENDING
            : TaskStatusEnum.COMPLETED,
        },
      }).unwrap();
    } catch (error) {
      console.error("Failed to update task status", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id).unwrap();
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        mb: 1,
        cursor: "pointer",
        bgcolor: isSelected ? "action.selected" : "background.paper",
      }}
      onClick={!isSelectMode ? onEdit : undefined}
    >
      {isSelectMode && (
        <Checkbox checked={isSelected} onChange={onSelect} sx={{ mr: 2 }} />
      )}

      <Box sx={{ flexGrow: 1 }}>
        <Typography
          sx={{
            textDecoration: isCompleted ? "line-through" : "none",
            color: isCompleted ? "text.secondary" : "text.primary",
          }}
        >
          {task.title}
        </Typography>
      </Box>

      <Box>
        <IconButton
          color={isCompleted ? "success" : "default"}
          onClick={(e) => {
            e.stopPropagation();
            handleToggleComplete();
          }}
        >
          <CheckCircleIcon />
        </IconButton>

        <IconButton
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default TaskTile;
