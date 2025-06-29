export type Exam = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  program: string;
  course: string;
  area: string;
  status: 'Completed' | 'In Progress' | 'Pending' | 'Synced';
};

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
  
export type StudentDetails = {
  username: string;
  fullName: string;
  email: string;
  group: string;
  sessionHealth: "Good" | "Warning" | "Critical";
  loginLogoutTimeline: { time: string; action: "login" | "logout" }[];
}

  