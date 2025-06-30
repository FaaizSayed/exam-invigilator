import type { Exam } from '../types/exam';

export const getUniqueSorted = (arr: string[]) => {
  const unique: string[] = [];
  for (const item of arr) {
    if (!unique.includes(item)) {
      unique.push(item);
    }
  }
  return unique.sort();
};

export const buildProgramTree = (data: Exam[]) => {
  const areaMap: Record<string, Set<string>> = {};
  data.forEach(item => {
    if (!areaMap[item.area]) areaMap[item.area] = new Set();
    areaMap[item.area].add(item.program);
  });

  return Object.entries(areaMap).map(([area, programSet]) => ({
    label: area,
    children: Array.from(programSet).map(program => ({ label: program })),
  }));
};
