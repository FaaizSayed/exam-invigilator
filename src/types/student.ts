export interface StudentDetails {
    username: string;
    fullName: string;
    email: string;
    group: string;
    sessionHealth: "Good" | "Warning" | "Critical";
    loginLogoutTimeline: { time: string; action: "login" | "logout" }[];
  }
  