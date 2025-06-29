import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AssessmentList from "../AssessmentList";
import * as api from "../../api/assessments";
import "@testing-library/jest-dom";
import type { Exam } from "../../types/assessment";

const mockData: Exam[] = [
  {
    id: "A1",
    area: "Middle East",
    program: "BSc CS",
    course: "AI",
    name: "AI Midterm 2025",
    startDate: "2025-07-01T09:00:00Z",
    endDate: "2025-07-01T12:00:00Z",
    status: "Pending",
  },
  {
    id: "A2",
    area: "Europe",
    program: "MBA",
    course: "Finance",
    name: "Finance Final 2025",
    startDate: "2025-07-10T14:00:00Z",
    endDate: "2025-07-10T16:00:00Z",
    status: "Completed",
  },
];

vi.spyOn(api, "fetchAssessments").mockResolvedValue(mockData);

const renderWithRouter = () =>
  render(
    <MemoryRouter>
      <AssessmentList />
    </MemoryRouter>
  );

describe("AssessmentList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders table with data", async () => {
    renderWithRouter();

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    expect(await screen.findByText("Middle East")).toBeInTheDocument();
    expect(screen.getByText("AI Midterm 2025")).toBeInTheDocument();
    expect(screen.getByText("Europe")).toBeInTheDocument();
  });

  it("filters by area", async () => {
    renderWithRouter();

    await screen.findByText("Middle East");
    const user = userEvent.setup();

    const areaSelect = screen.getByRole("combobox", { name: /area/i });
    await user.click(areaSelect);

    await user.click(await screen.findByRole("option", { name: "Europe" }));

    expect(screen.queryByText("Middle East")).not.toBeInTheDocument();
  });

  it("shows success message on sync", async () => {
    renderWithRouter();

    await screen.findByText("AI Midterm 2025");
    const syncButton = screen.getAllByText("Sync Submissions")[0];

    fireEvent.click(syncButton);

    expect(
      await screen.findByText("Submissions synced successfully!")
    ).toBeInTheDocument();
  });

  it("handles empty data gracefully", async () => {
    vi.spyOn(api, "fetchAssessments").mockResolvedValue([]);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText("No assessments found")).toBeInTheDocument();
    });
  });

  it("shows error state when API fails", async () => {
    vi.spyOn(api, "fetchAssessments").mockRejectedValue(
      new Error("Network error")
    );

    renderWithRouter();

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to load assessments/)
      ).toBeInTheDocument();
    });
  });

  it("disables sync button for already synced assessments", async () => {
    const syncedData = [{ ...mockData[0], status: "Synced" as const }];
    vi.spyOn(api, "fetchAssessments").mockResolvedValue(syncedData);

    renderWithRouter();

    await screen.findByText("AI Midterm 2025");
    const syncButton = screen.getByText("Sync Submissions");

    expect(syncButton).toBeDisabled();
  });

  it("shows loading state during sync", async () => {
    renderWithRouter();

    await screen.findByText("AI Midterm 2025");
    const syncButton = screen.getAllByText("Sync Submissions")[0];

    fireEvent.click(syncButton);

    expect(screen.getByText("Syncing...")).toBeInTheDocument();
  });
});
