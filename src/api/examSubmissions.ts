import type { ExamSubmission } from '../types/examSubmission';

const submissions: Record<string, ExamSubmission[]> = {
  A1: [
    {
      id: 'S1',
      assessmentId: 'A1',
      username: 'john123',
      fullName: 'John Doe',
      group: 'A',
      login: '2025-07-01T09:05:00Z',
      start: '2025-07-01T09:10:00Z',
      questionsSynced: 20,
      timeElapsed: 85,
      status: 'Student Submission',
    },
    {
      id: 'S2',
      assessmentId: 'A1',
      username: 'jane456',
      fullName: 'Jane Smith',
      group: 'B',
      login: '2025-07-01T09:00:00Z',
      start: '2025-07-01T09:05:00Z',
      questionsSynced: 22,
      timeElapsed: 120,
      status: 'Absent',
    }
  ],
  A2: [
    {
      id: 'S3',
      assessmentId: 'A2',
      username: 'mark789',
      fullName: 'Mark Brown',
      group: 'A',
      login: '2025-07-10T14:00:00Z',
      start: '2025-07-10T14:05:00Z',
      questionsSynced: 25,
      timeElapsed: 110,
      status: 'Completed',
    }
  ]
};

export function fetchExamSubmissions(assessmentId: string): Promise<ExamSubmission[]> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(submissions[assessmentId] || []), 500)
  );
}
