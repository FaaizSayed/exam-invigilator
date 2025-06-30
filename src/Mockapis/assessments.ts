import type { Exam } from '../types/exam';

export const assessments: Exam[] = [
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

export const mockAssessments: Exam[] = [
  {
    id: "1",
    name: "Advanced Mathematics Final Exam",
    startDate: "2024-01-15",
    endDate: "2024-01-20",
    program: "Computer Science",
    course: "Calculus III",
    area: "Engineering",
    status: "Completed"
  },
  {
    id: "2",
    name: "Database Systems Midterm",
    startDate: "2024-01-22",
    endDate: "2024-01-25",
    program: "Information Technology",
    course: "Database Management",
    area: "Technology",
    status: "In Progress"
  },
  {
    id: "3",
    name: "Web Development Project",
    startDate: "2024-01-28",
    endDate: "2024-02-05",
    program: "Software Engineering",
    course: "Web Technologies",
    area: "Technology",
    status: "Pending"
  },
  {
    id: "4",
    name: "Business Ethics Final",
    startDate: "2024-02-10",
    endDate: "2024-02-15",
    program: "Business Administration",
    course: "Business Ethics",
    area: "Business",
    status: "Completed"
  },
  {
    id: "5",
    name: "Marketing Strategy Exam",
    startDate: "2024-02-18",
    endDate: "2024-02-22",
    program: "Marketing",
    course: "Strategic Marketing",
    area: "Business",
    status: "In Progress"
  },
  {
    id: "6",
    name: "Organic Chemistry Lab",
    startDate: "2024-02-25",
    endDate: "2024-03-01",
    program: "Chemistry",
    course: "Organic Chemistry",
    area: "Science",
    status: "Pending"
  },
  {
    id: "7",
    name: "Physics Mechanics Final",
    startDate: "2024-03-05",
    endDate: "2024-03-10",
    program: "Physics",
    course: "Classical Mechanics",
    area: "Science",
    status: "Completed"
  },
  {
    id: "8",
    name: "Data Structures & Algorithms",
    startDate: "2024-03-12",
    endDate: "2024-03-18",
    program: "Computer Science",
    course: "Data Structures",
    area: "Engineering",
    status: "In Progress"
  },
  {
    id: "9",
    name: "Financial Accounting Exam",
    startDate: "2024-03-20",
    endDate: "2024-03-25",
    program: "Accounting",
    course: "Financial Accounting",
    area: "Business",
    status: "Pending"
  },
  {
    id: "10",
    name: "Machine Learning Project",
    startDate: "2024-03-28",
    endDate: "2024-04-05",
    program: "Artificial Intelligence",
    course: "Machine Learning",
    area: "Technology",
    status: "Completed"
  },
  {
    id: "11",
    name: "Human Anatomy Final",
    startDate: "2024-04-10",
    endDate: "2024-04-15",
    program: "Medicine",
    course: "Human Anatomy",
    area: "Health Sciences",
    status: "In Progress"
  },
  {
    id: "12",
    name: "Environmental Science Quiz",
    startDate: "2024-04-18",
    endDate: "2024-04-22",
    program: "Environmental Science",
    course: "Environmental Studies",
    area: "Science",
    status: "Pending"
  },
  {
    id: "13",
    name: "Digital Marketing Campaign",
    startDate: "2024-04-25",
    endDate: "2024-05-02",
    program: "Digital Marketing",
    course: "Digital Campaigns",
    area: "Business",
    status: "Completed"
  },
  {
    id: "14",
    name: "Software Testing Methods",
    startDate: "2024-05-05",
    endDate: "2024-05-10",
    program: "Software Engineering",
    course: "Software Testing",
    area: "Technology",
    status: "In Progress"
  },
  {
    id: "15",
    name: "International Business Law",
    startDate: "2024-05-12",
    endDate: "2024-05-18",
    program: "International Business",
    course: "Business Law",
    area: "Business",
    status: "Pending"
  },
];

export async function fetchAssessments(): Promise<Exam[]> {
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

export async function getAssessmentById(id: string): Promise<Exam | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const assessment = assessments.find(a => a.id === id);
  return assessment || null;
}

export const getAssessments = async (): Promise<Exam[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // throw new Error("Failed to fetch assessments"); // You can uncomment this to see the failing scenario
  return mockAssessments;
};

export const syncSubmissions = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
};
