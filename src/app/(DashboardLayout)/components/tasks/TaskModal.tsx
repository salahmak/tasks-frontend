import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  TaskStatusEnum,
  TaskCreate,
  TaskResponseSchema,
  TaskUpdate,
} from "@/lib/types/api.types";
import {
  useAddTaskMutation,
  useUpdateTaskMutation,
} from "@/lib/redux/features/api/apiSlice";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  task?: TaskResponseSchema; // Optional task for editing
}

const TaskModal: React.FC<TaskModalProps> = ({ open, onClose, task }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatusEnum>(TaskStatusEnum.PENDING);

  const [addTask, { isLoading: isAdding }] = useAddTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  // Populate form when task prop changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setStatus(task.status);
    } else {
      // Reset form for new task
      setTitle("");
      setDescription("");
      setStatus(TaskStatusEnum.PENDING);
    }
  }, [task, open]);

  const handleSubmit = async () => {
    try {
      if (task) {
        // Update existing task
        const updatePayload: TaskUpdate = {
          title,
          description,
          status,
        };
        await updateTask({ id: task.id, task: updatePayload }).unwrap();
      } else {
        // Create new task
        const newTask: TaskCreate = {
          title,
          description,
          status,
        };
        await addTask(newTask).unwrap();
      }

      // Close modal after successful operation
      onClose();
    } catch (error) {
      console.error("Failed to save task", error);
      // TODO: Add error handling (e.g., show error message)
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Task Title"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value as TaskStatusEnum)}
          >
            <MenuItem value={TaskStatusEnum.PENDING}>Pending</MenuItem>
            <MenuItem value={TaskStatusEnum.COMPLETED}>Completed</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={!title || isAdding || isUpdating}
        >
          {task ? "Update Task" : "Add Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;
