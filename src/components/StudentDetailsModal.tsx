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
} from "@mui/material";
import type { StudentDetails } from "../types/student";

const mockStudent: StudentDetails = {
  username: "john123",
  fullName: "John Doe",
  email: "john123@exam.com",
  group: "A",
  sessionHealth: "Good",
  loginLogoutTimeline: [
    { time: "2025-07-01T09:05:00Z", action: "login" },
    { time: "2025-07-01T10:10:00Z", action: "logout" },
    { time: "2025-07-01T10:20:00Z", action: "login" },
    { time: "2025-07-01T12:00:00Z", action: "logout" },
  ],
};

type Props = {
  username: string;
  onClose: () => void;
};

export default function StudentDetailsModal({ username, onClose }: Props) {
  const student = { ...mockStudent, username };

  return (
    <Dialog open={true} onClose={onClose} fullWidth>
      <DialogTitle>Student Details - {student.username}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">
          {student.fullName} ({student.group})
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Email: {student.email}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Session Health: {student.sessionHealth}
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Login/Logout Timeline:
        </Typography>
        <List>
          {student.loginLogoutTimeline.map((entry, idx) => (
            <ListItem key={idx} disablePadding>
              <ListItemText
                primary={`${entry.action.toUpperCase()} @ ${new Date(
                  entry.time
                ).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
