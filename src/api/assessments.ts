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
  },
  {
    id: 'A4',
    area: 'North America',
    program: 'MSc',
    course: 'Data Science',
    name: 'DS Capstone Project',
    startDate: '2025-08-01T13:00:00Z',
    endDate: '2025-08-01T17:00:00Z',
    status: 'In Progress',
  }
];

export async function fetchAssessments(): Promise<Assessment[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
    const sortedAssessments = [...assessments].sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
    return sortedAssessments;
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch assessments: ${error.message}`);
    }
    throw new Error('Unknown error occurred while fetching assessments');
  }
}

export async function syncAssessment(assessmentId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  if (Math.random() < 0.1) {
    throw new Error('Sync failed - server unavailable');
  }
  const assessment = assessments.find(a => a.id === assessmentId);
  if (assessment) {
    assessment.status = 'Synced';
  }
}

export async function getAssessmentById(id: string): Promise<Assessment | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const assessment = assessments.find(a => a.id === id);
  return assessment || null;
}
