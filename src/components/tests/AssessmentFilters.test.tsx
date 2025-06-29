import { render, screen } from "@testing-library/react";
import AssessmentFilters from "../AssessmentFilters";
import "@testing-library/jest-dom";
import type { Exam } from "../../types/exam";

const mockData: Exam[] = [
  {
    id: "A1",
    area: "Asia",
    program: "BSc",
    course: "Math",
    name: "Exam1",
    startDate: "",
    endDate: "",
    status: "Pending",
  },
  {
    id: "A2",
    area: "Europe",
    program: "MBA",
    course: "AI",
    name: "Exam2",
    startDate: "",
    endDate: "",
    status: "Completed",
  },
];

test("renders all filter fields", () => {
  render(
    <AssessmentFilters
      data={mockData}
      filters={{ area: "", program: "", course: "", status: "" }}
      setFilters={() => {}}
    />
  );
  expect(screen.getByLabelText("Area")).toBeInTheDocument();
  expect(screen.getByLabelText("Program")).toBeInTheDocument();
  expect(screen.getByLabelText("Course")).toBeInTheDocument();
  expect(screen.getByLabelText("Status")).toBeInTheDocument();
});
