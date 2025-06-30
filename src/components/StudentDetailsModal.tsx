import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import type { Submission } from '../types/exam';

type StudentDetailsModalProps = {
  studentDetails?: Submission;
  onClose: () => void;
};

export default function StudentDetailsModal({
  studentDetails,
  onClose,
}: StudentDetailsModalProps) {
  const isOpen = !!studentDetails;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>
        Student Details{studentDetails ? ` – ${studentDetails.username}` : ''}
      </DialogTitle>
      <DialogContent>
        {studentDetails ? (
          <List dense>
            <ListItem>
              <ListItemText
                primary="Full Name"
                secondary={studentDetails.fullName}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Area" secondary={studentDetails.area} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Group" secondary={studentDetails.group} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Login Time"
                secondary={
                  studentDetails.login
                    ? new Date(studentDetails.login).toLocaleString()
                    : '-'
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Start Time"
                secondary={
                  studentDetails.start
                    ? new Date(studentDetails.start).toLocaleString()
                    : '-'
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Questions Synced"
                secondary={studentDetails.questionsSynced}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Time Elapsed (min)"
                secondary={studentDetails.timeElapsed}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Status"
                secondary={studentDetails.status}
              />
            </ListItem>
          </List>
        ) : (
          <Typography>No data found for this student.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
