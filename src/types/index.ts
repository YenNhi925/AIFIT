export type Role = 'Trainee' | 'Admin';
export type UserStatus = 'Active' | 'Locked';
export type ExerciseStatus = 'Active' | 'Inactive';
export type RuleType = 'Correct' | 'Error';
export type LogType = 'Camera denied' | 'Body lost' | 'Sync failed' | 'API error';

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: Role;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
}

export interface Exercise {
  id: number;
  name: string;
  description: string;
  jointSet: string;
  mode: 'reps' | 'hold';
  status: ExerciseStatus;
}

export interface ExerciseRule {
  id: number;
  exerciseId: number;
  exercise: string;
  jointSet: string;
  metric: string;
  min: number | null;
  max: number | null;
  type: RuleType;
  label: string;
  voice: string;
  ref: string;
  version: number;
  status: 'Active' | 'Inactive';
}

export interface RepResult {
  rep: number;
  correct: boolean;
  errors?: string[];
}

export interface ErrorSummary {
  label: string;
  count: number;
}

export interface WorkoutSession {
  id: number;
  exerciseId: number;
  exercise: string;
  date: string;
  durationSec: number;
  totalReps: number;
  correctReps: number;
  incorrectReps: number;
  accuracy: number;
  correctHoldSec?: number;
  incorrectHoldSec?: number;
  repResults: RepResult[];
  errors: ErrorSummary[];
  avgFps: number;
  avgVisibility: number;
  bodyLostCount: number;
  synced: boolean;
}

export interface SystemLog {
  id: number;
  time: string;
  user: string;
  exercise: string;
  type: LogType;
  message: string;
}
