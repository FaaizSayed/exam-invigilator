# Exam Invigilator Web App

A React-based web application for managing and monitoring exam submissions in real-time.

## Features

- View and filter downloaded assessments
- Drill down to track exam submissions per assessment
- Filter, sort, and paginate students/examinees
- Real-time status updates and actions
- Responsive, accessible, and clean Material UI design
- Mock API data (easy to switch to real API)
- TypeScript type safety everywhere

## Stack

- React 19 + TypeScript (Vite)
- Material UI (MUI) v7
- React Router v7
- Vitest for testing

## Quick Start

1. Clone this repo (or copy files into a new Vite + React + TS app)
2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for development
- `npm run build:prod` - Build for production
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── api/           # API layer and mock data
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── tests/         # Test files
```

## Testing

Automated tests for filtering, sorting, and key component rendering are included.

```bash
npm run test
```

## TODO

- [ ] Add error boundaries
- [ ] Implement real-time updates with WebSocket
- [ ] Add dark mode support
- [ ] Improve accessibility
- [ ] Add more comprehensive tests
- [ ] Set up CI/CD pipeline
- [ ] Add performance monitoring

## Known Issues

- Some edge cases in date formatting (see utils/date.ts)
- Occasional flaky tests (marked with FIXME)
- Missing 404 route handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run linting and tests
6. Submit a pull request

## License

MIT License - see LICENSE file for details
