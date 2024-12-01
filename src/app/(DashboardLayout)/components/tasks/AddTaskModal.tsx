import React, { useState } from "react";
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
import { TaskStatusEnum, TaskCreate } from "@/lib/types/api.types";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ open, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatusEnum>(TaskStatusEnum.PENDING);

  const handleSubmit = () => {
    const newTask: TaskCreate = {
      title,
      description,
      status,
    };

    // TODO: Add task mutation logic here
    console.log("New Task:", newTask);

    // Reset form and close modal
    setTitle("");
    setDescription("");
    setStatus(TaskStatusEnum.PENDING);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Task</DialogTitle>
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
            <MenuItem value={TaskStatusEnum.IN_PROGRESS}>In Progress</MenuItem>
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
          disabled={!title}
        >
          Add Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskModal;
