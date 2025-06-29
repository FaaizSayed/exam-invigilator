import type { Submission } from '../types/exam';

export const mockSubmissions: Submission[] = [
  {
    id: "1",
    username: "john.doe",
    fullName: "John Doe",
    area: "Engineering",
    group: "Computer Science",
    login: "2024-01-15T09:00:00Z",
    start: "2024-01-15T09:05:00Z",
    questionsSynced: 10,
    timeElapsed: 120,
    status: "Completed"
  },
  {
    id: "2",
    username: "jane.smith",
    fullName: "Jane Smith",
    area: "Technology",
    group: "Information Technology",
    login: "2024-01-15T09:10:00Z",
    start: "2024-01-15T09:15:00Z",
    questionsSynced: 7,
    timeElapsed: 90,
    status: "In Progress"
  },
  {
    id: "3",
    username: "mike.johnson",
    fullName: "Mike Johnson",
    area: "Technology",
    group: "Software Engineering",
    login: "2024-01-15T09:20:00Z",
    questionsSynced: 0,
    timeElapsed: 0,
    status: "Absent"
  },
  {
    id: "4",
    username: "sarah.wilson",
    fullName: "Sarah Wilson",
    area: "Business",
    group: "Business Administration",
    login: "2024-01-15T09:25:00Z",
    start: "2024-01-15T09:30:00Z",
    questionsSynced: 8,
    timeElapsed: 75,
    status: "Student Submission"
  },
  {
    id: "5",
    username: "david.brown",
    fullName: "David Brown",
    area: "Business",
    group: "Marketing",
    login: "2024-01-15T09:35:00Z",
    start: "2024-01-15T09:40:00Z",
    questionsSynced: 10,
    timeElapsed: 110,
    status: "Completed"
  },
  {
    id: "6",
    username: "emma.davis",
    fullName: "Emma Davis",
    area: "Science",
    group: "Chemistry",
    login: "2024-01-15T09:45:00Z",
    start: "2024-01-15T09:50:00Z",
    questionsSynced: 5,
    timeElapsed: 60,
    status: "In Progress"
  },
  {
    id: "7",
    username: "alex.taylor",
    fullName: "Alex Taylor",
    area: "Science",
    group: "Physics",
    login: "2024-01-15T10:00:00Z",
    start: "2024-01-15T10:05:00Z",
    questionsSynced: 10,
    timeElapsed: 95,
    status: "Completed"
  },
  {
    id: "8",
    username: "lisa.anderson",
    fullName: "Lisa Anderson",
    area: "Engineering",
    group: "Computer Science",
    login: "2024-01-15T10:10:00Z",
    start: "2024-01-15T10:15:00Z",
    questionsSynced: 3,
    timeElapsed: 45,
    status: "In Progress"
  },
  {
    id: "9",
    username: "tom.martinez",
    fullName: "Tom Martinez",
    area: "Business",
    group: "Accounting",
    login: "2024-01-15T10:20:00Z",
    start: "2024-01-15T10:25:00Z",
    questionsSynced: 10,
    timeElapsed: 130,
    status: "Completed"
  },
  {
    id: "10",
    username: "rachel.garcia",
    fullName: "Rachel Garcia",
    area: "Technology",
    group: "Artificial Intelligence",
    login: "2024-01-15T10:30:00Z",
    start: "2024-01-15T10:35:00Z",
    questionsSynced: 9,
    timeElapsed: 85,
    status: "Student Submission"
  },
  {
    id: "11",
    username: "kevin.lee",
    fullName: "Kevin Lee",
    area: "Health Sciences",
    group: "Medicine",
    login: "2024-01-15T10:40:00Z",
    start: "2024-01-15T10:45:00Z",
    questionsSynced: 6,
    timeElapsed: 70,
    status: "In Progress"
  },
  {
    id: "12",
    username: "amanda.white",
    fullName: "Amanda White",
    area: "Science",
    group: "Environmental Science",
    login: "2024-01-15T10:50:00Z",
    start: "2024-01-15T10:55:00Z",
    questionsSynced: 10,
    timeElapsed: 100,
    status: "Completed"
  },
  {
    id: "13",
    username: "chris.rodriguez",
    fullName: "Chris Rodriguez",
    area: "Business",
    group: "Digital Marketing",
    login: "2024-01-15T11:00:00Z",
    start: "2024-01-15T11:05:00Z",
    questionsSynced: 4,
    timeElapsed: 50,
    status: "In Progress"
  },
  {
    id: "14",
    username: "jessica.thompson",
    fullName: "Jessica Thompson",
    area: "Technology",
    group: "Software Engineering",
    login: "2024-01-15T11:10:00Z",
    start: "2024-01-15T11:15:00Z",
    questionsSynced: 10,
    timeElapsed: 115,
    status: "Completed"
  },
  {
    id: "15",
    username: "ryan.clark",
    fullName: "Ryan Clark",
    area: "Business",
    group: "International Business",
    login: "2024-01-15T11:20:00Z",
    questionsSynced: 0,
    timeElapsed: 0,
    status: "Absent"
  }
];

export const getExamSubmissions = async (): Promise<Submission[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockSubmissions;
};
