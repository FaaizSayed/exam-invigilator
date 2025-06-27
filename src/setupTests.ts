// src/setupTests.ts
// --------------------------------------------------
// Vitest + React Testing Library global test setup
// --------------------------------------------------

import '@testing-library/jest-dom';       // ⬅ adds .toBeInTheDocument() and other matchers
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Automatically unmount and cleanup DOM after each test
afterEach(() => {
  cleanup();
});
