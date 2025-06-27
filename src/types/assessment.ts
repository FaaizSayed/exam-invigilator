export interface Assessment {
    id: string;
    area: string;
    program: string;
    course: string;
    name: string;
    startDate: string;
    endDate: string;
    status: "Pending" | "In Progress" | "Completed" | "Synced";
  }
  