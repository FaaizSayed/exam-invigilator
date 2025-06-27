import type { Assessment } from '../types/assessment';

export const assessments: Assessment[] = [
  {
    id: 'A1',
    area: 'Middle East',
    program: 'BSc CS',
    course: 'AI',
    name: 'AI Midterm 2025',
    startDate: '2025-07-01T09:00:00Z',
    endDate: '2025-07-01T12:00:00Z',
    status: 'Pending',
  },
  {
    id: 'A2',
    area: 'Europe',
    program: 'MBA',
    course: 'Finance',
    name: 'Finance Final 2025',
    startDate: '2025-07-10T14:00:00Z',
    endDate: '2025-07-10T16:00:00Z',
    status: 'Completed',
  },
  {
    id: 'A3',
    area: 'Asia',
    program: 'BTech',
    course: 'Math',
    name: 'Maths Internal',
    startDate: '2025-06-15T10:00:00Z',
    endDate: '2025-06-15T12:00:00Z',
    status: 'Synced',
  }
];

export function fetchAssessments(): Promise<Assessment[]> {
  return new Promise((resolve) => setTimeout(() => resolve(assessments), 500));
}
