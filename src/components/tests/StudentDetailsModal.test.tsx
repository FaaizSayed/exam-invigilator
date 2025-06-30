import { render, screen } from '@testing-library/react';
import StudentDetailsModal from '../StudentDetailsModal';
import type { Submission } from '../../types/exam';

const sampleStudent: Submission = {
  id: '1',
  username: 'john.doe',
  fullName: 'John Doe',
  area: 'Engineering',
  group: 'Computer Science',
  login: '2024-01-15T09:00:00Z',
  start: '2024-01-15T09:05:00Z',
  questionsSynced: 10,
  timeElapsed: 120,
  status: 'Completed',
};

describe('StudentDetailsModal', () => {
  it('shows all student info fields', () => {
    render(
      <StudentDetailsModal studentDetails={sampleStudent} onClose={() => {}} />
    );

    expect(screen.getByText(/Student Details/i)).toBeInTheDocument();
    expect(screen.getAllByText(/john.doe/i).length).toBeGreaterThan(0);

    expect(screen.getByText('Full Name')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    expect(screen.getByText('Area')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();

    expect(screen.getByText('Group')).toBeInTheDocument();
    expect(screen.getByText('Computer Science')).toBeInTheDocument();

    expect(screen.getByText('Questions Synced')).toBeInTheDocument();
    expect(
      screen.getByText(String(sampleStudent.questionsSynced))
    ).toBeInTheDocument();

    expect(screen.getByText('Time Elapsed (min)')).toBeInTheDocument();
    expect(
      screen.getByText(String(sampleStudent.timeElapsed))
    ).toBeInTheDocument();

    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();

    expect(screen.getByText('Close')).toBeInTheDocument();
  });
});
