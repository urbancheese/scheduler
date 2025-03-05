import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Grid,
  Typography,
} from '@mui/material';
import { useTaskContext } from '../context/TaskContext';
import { v4 as uuidv4 } from 'uuid';

type FormData = {
  name: string;
  description: string;
  triggerType: 'time' | 'event' | 'manual';
  schedule: string;
  condition: string;
  actionType: 'notification' | 'script' | 'device';
  actionDetails: string;
};

const TaskForm: React.FC = () => {
  const { dispatch } = useTaskContext();
  const { control, handleSubmit, watch, reset } = useForm<FormData>();

  const triggerType = watch('triggerType');
  const actionType = watch('actionType');

  const onSubmit = (data: FormData) => {
    const newTask = {
      id: uuidv4(),
      name: data.name,
      description: data.description,
      trigger: {
        type: data.triggerType,
        schedule: data.schedule,
        condition: data.condition,
      },
      action: {
        type: data.actionType,
        details: data.actionDetails,
      },
      isActive: true,
      lastRun: undefined,
      nextRun: undefined,
    };

    dispatch({ type: 'ADD_TASK', payload: newTask });
    reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Create New Task
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Task Name"
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Description"
                multiline
                rows={1}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Controller
              name="triggerType"
              control={control}
              defaultValue="time"
              render={({ field }) => (
                <>
                  <InputLabel>Trigger Type</InputLabel>
                  <Select {...field} label="Trigger Type">
                    <MenuItem value="time">Time-based</MenuItem>
                    <MenuItem value="event">Event-based</MenuItem>
                    <MenuItem value="manual">Manual</MenuItem>
                  </Select>
                </>
              )}
            />
          </FormControl>
        </Grid>
        {triggerType === 'time' && (
          <Grid item xs={12} sm={6}>
            <Controller
              name="schedule"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Schedule (cron format)"
                  placeholder="0 8 * * *"
                />
              )}
            />
          </Grid>
        )}
        {triggerType === 'event' && (
          <Grid item xs={12} sm={6}>
            <Controller
              name="condition"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Condition"
                  placeholder="CPU usage > 80%"
                />
              )}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Controller
              name="actionType"
              control={control}
              defaultValue="notification"
              render={({ field }) => (
                <>
                  <InputLabel>Action Type</InputLabel>
                  <Select {...field} label="Action Type">
                    <MenuItem value="notification">Send Notification</MenuItem>
                    <MenuItem value="script">Run Script</MenuItem>
                    <MenuItem value="device">Control Device</MenuItem>
                  </Select>
                </>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="actionDetails"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Action Details"
                placeholder={actionType === 'notification' ? 'Notification message' : 
                           actionType === 'script' ? 'Script path or command' :
                           'Device control command'}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Create Task
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TaskForm;