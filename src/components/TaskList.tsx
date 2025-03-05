import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  Chip,
  Box,
  Switch,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useTaskContext } from '../context/TaskContext';
import { format } from 'date-fns';

const TaskList: React.FC = () => {
  const { state, dispatch } = useTaskContext();

  const handleToggle = (taskId: string) => {
    dispatch({ type: 'TOGGLE_TASK', payload: taskId });
  };

  const handleDelete = (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  };

  const getTriggerLabel = (task: Task) => {
    switch (task.trigger.type) {
      case 'time':
        return `Schedule: ${task.trigger.schedule}`;
      case 'event':
        return `Condition: ${task.trigger.condition}`;
      case 'manual':
        return 'Manual trigger';
      default:
        return '';
    }
  };

  const getActionLabel = (task: Task) => {
    switch (task.action.type) {
      case 'notification':
        return 'Notification';
      case 'script':
        return 'Script';
      case 'device':
        return 'Device Control';
      default:
        return '';
    }
  };

  if (state.tasks.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="textSecondary">
          No tasks created yet. Create your first task above!
        </Typography>
      </Paper>
    );
  }

  return (
    <List>
      {state.tasks.map((task) => (
        <ListItem
          key={task.id}
          sx={{
            mb: 2,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6">{task.name}</Typography>
                <Chip
                  size="small"
                  label={task.trigger.type}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  size="small"
                  label={getActionLabel(task)}
                  color="secondary"
                  variant="outlined"
                />
              </Box>
            }
            secondary={
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  {task.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {getTriggerLabel(task)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Action: {task.action.details}
                </Typography>
              </Box>
            }
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={task.isActive}
              onChange={() => handleToggle(task.id)}
            />
            <IconButton
              edge="end"
              aria-label="edit"
              sx={{ ml: 1 }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDelete(task.id)}
              sx={{ ml: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default TaskList;