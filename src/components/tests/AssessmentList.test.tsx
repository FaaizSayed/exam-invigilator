import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AssessmentList from "../AssessmentList";
import * as api from "../../api/assessments";
import "@testing-library/jest-dom";
import type { Assessment } from "../../types/assessment";

/* ---------- mock API data ---------- */
const mockData: Assessment[] = [
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

/* spy on the API and return the mock data instantly */
vi.spyOn(api, "fetchAssessments").mockResolvedValue(mockData);

/* handy helper – keeps each test DRY */
const renderWithRouter = () =>
  render(
    <MemoryRouter>
      <AssessmentList />
    </MemoryRouter>
  );

describe("AssessmentList", () => {
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

    expect(await screen.findByText("Submissions synced!")).toBeInTheDocument();
  });
});
