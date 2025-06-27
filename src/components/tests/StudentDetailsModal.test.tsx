import { render, screen } from "@testing-library/react";
import StudentDetailsModal from "../StudentDetailsModal";

describe("StudentDetailsModal", () => {
  it("shows student info and timeline", () => {
    render(<StudentDetailsModal username="john123" onClose={() => {}} />);

    expect(screen.getByText(/Student Details - john123/)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/Session Health/)).toBeInTheDocument();
    expect(screen.getAllByText(/LOGIN @/i).length).toBeGreaterThan(0);
    expect(screen.getByText("Close")).toBeInTheDocument();
  });
});
