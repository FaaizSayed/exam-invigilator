export type Submission = {
  id: string;
  username: string;
  fullName: string;
  area: string;
  group: string;
  login?: string;
  start?: string;
  questionsSynced: number;
  timeElapsed: number;
  status: 'Completed' | 'In Progress' | 'Student Submission' | 'Absent';
};
  