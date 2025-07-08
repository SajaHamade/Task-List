import React, { useState, useEffect, useCallback } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import { API_URL } from "../utils";

export const UpdateTask = ({
  fetchTasks,
  isDialogOpen,
  setIsDialogOpen,
  task,
}) => {
  const [taskName, setTaskName] = useState("");

  useEffect(() => {
    if (isDialogOpen && task && task.name) {
      setTaskName(task.name);
    }
  }, [isDialogOpen, task]);

  const handleUpdateTaskName = async () => {
    console.log("task to be updated", task);
    if (!task?.id) {
      console.error("No task ID available");
      return;
    }

    try {
      await axios.put(API_URL, {
        id: task.id,
        name: taskName,
        completed: task.completed,
      });

      await fetchTasks();
      setIsDialogOpen(false);
      setTaskName("");
    } catch (error) {
      console.error("Error during PUT:", error);
    }
  };

  const handleChange = useCallback((e) => {
    setTaskName(e.target.value);
  }, []);
  return (
    <Dialog open={isDialogOpen}>
      <DialogTitle>Edit Task</DialogTitle>
      <div className="dialog">
        <TextField
          size="small"
          label="Task"
          variant="outlined"
          value={taskName}
          onChange={handleChange}
        />
        <Button variant="contained" onClick={handleUpdateTaskName}>
          <CheckIcon />
        </Button>
      </div>
    </Dialog>
  );
};
