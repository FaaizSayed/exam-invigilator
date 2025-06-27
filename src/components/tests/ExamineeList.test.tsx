import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExamineeList from "../ExamineeList";
import * as api from "../../api/examSubmissions";
import "@testing-library/jest-dom";
import type { ExamSubmission } from "../../types/examSubmission";

const mockSubmissions: ExamSubmission[] = [
  {
    id: "S1",
    assessmentId: "A1",
    username: "john123",
    fullName: "John Doe",
    group: "A",
    login: "2025-07-01T09:05:00Z",
    start: "2025-07-01T09:10:00Z",
    questionsSynced: 20,
    timeElapsed: 85,
    status: "Student Submission",
  },
  {
    id: "S2",
    assessmentId: "A1",
    username: "jane456",
    fullName: "Jane Smith",
    group: "B",
    login: "2025-07-01T09:00:00Z",
    start: "2025-07-01T09:05:00Z",
    questionsSynced: 22,
    timeElapsed: 120,
    status: "Absent",
  },
];

vi.spyOn(api, "fetchExamSubmissions").mockResolvedValue(mockSubmissions);

describe("ExamineeList", () => {
  it("renders examinee data", async () => {
    render(<ExamineeList assessmentId="A1" />);
    expect(await screen.findByText("john123")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("jane456")).toBeInTheDocument();
  });

  it("filters by group", async () => {
    render(<ExamineeList assessmentId="A1" />);
    await screen.findByText("john123");

    const user = userEvent.setup();

    // 1️⃣ Open the Group combobox (dropdown)
    const groupCombo = screen.getByRole("combobox", { name: /group/i });
    await user.click(groupCombo);

    // 2️⃣ Click the "B" option in the dropdown
    await user.click(await screen.findByRole("option", { name: "B" }));

    // 3️⃣ Assert the table only shows group B
    expect(screen.getByText("jane456")).toBeInTheDocument();
    expect(screen.queryByText("john123")).not.toBeInTheDocument();
  });

  it("shows modal when username clicked", async () => {
    render(<ExamineeList assessmentId="A1" />);
    await screen.findByText("john123");
    // fireEvent.click still works fine for a button
    screen.getByText("john123").click();
    expect(await screen.findByText(/Student Details/)).toBeInTheDocument();
    expect(screen.getByText("John Doe (A)")).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();
  });
});
