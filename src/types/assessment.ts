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
  