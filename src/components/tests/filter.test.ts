import { describe, it, expect } from "vitest";
import type { Exam } from "../../types/assessment";

const assessments: Exam[] = [
  { id: '1', area: 'Europe', program: 'MBA', course: 'AI', name: 'Test', startDate: '', endDate: '', status: 'Pending' },
  { id: '2', area: 'Asia', program: 'BSc', course: 'Math', name: 'Test2', startDate: '', endDate: '', status: 'Completed' }
];

function filterByArea(data: Exam[], area: string) {
  return data.filter(a => a.area === area);
}

describe("Assessment Filtering", () => {
  it("filters by area", () => {
    const filtered = filterByArea(assessments, "Europe");
    expect(filtered.length).toBe(1);
    expect(filtered[0].area).toBe("Europe");
  });
});
