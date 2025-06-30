export const getUniqueSorted = (arr: string[]) => {
    const unique: string[] = [];
    for (const item of arr) {
      if (!unique.includes(item)) {
        unique.push(item);
      }
    }
    return unique.sort();
  };