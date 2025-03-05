import React, { createContext, useContext, useReducer, ReactNode } from 'react';

type TaskTrigger = {
  type: 'time' | 'event' | 'manual';
  schedule?: string;
  condition?: string;
};

type TaskActionType = {
  type: 'notification' | 'script' | 'device';
  details: string;
};

export type Task = {
  id: string;
  name: string;
  description: string;
  trigger: TaskTrigger;
  action: TaskActionType;
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
};

type TaskState = {
  tasks: Task[];
};

type TaskAction = 
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string };

const initialState: TaskState = {
  tasks: [],
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? { ...task, isActive: !task.isActive }
            : task
        ),
      };
    default:
      return state;
  }
};

type TaskContextType = {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};