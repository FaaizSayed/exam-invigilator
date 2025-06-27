export interface ExamSubmission {
    id: string;
    assessmentId: string;
    username: string;
    fullName: string;
    group: string;
    login: string;
    start: string;
    questionsSynced: number;
    timeElapsed: number;
    status: "Student Submission" | "Absent" | "In Progress" | "Completed";
  }
  