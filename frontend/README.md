# AI4Devs Frontend

This is the frontend application for the AI4Devs HR System.

## Features

### Kanban Board View
- **Route**: `/positions/:id/kanban`
- **Description**: A Kanban board that displays interview steps for a specific position
- **Features**:
  - Back arrow navigation to positions list
  - Dynamic columns based on interview steps from API
  - Responsive design with Bootstrap
  - Demo mode when API is unavailable

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Navigate to the application:
   - Home: `http://localhost:3000/`
   - Positions: `http://localhost:3000/positions`
   - Kanban Board: `http://localhost:3000/positions/1/kanban`

## API Integration

The Kanban board expects the following API endpoint:
- `GET /positions/:id/interviewFlow`

### Expected Response Format:
```json
{
  "positionName": "Senior Backend Engineer",
  "interviewFlow": {
    "id": 1,
    "description": "Standard development interview process",
    "interviewSteps": [
      { "id": 1, "name": "Initial Screening", "orderIndex": 1 },
      { "id": 2, "name": "Technical Interview", "orderIndex": 2 },
      { "id": 3, "name": "Manager Interview", "orderIndex": 3 }
    ]
  }
}
```

## Demo Mode

If the API is unavailable, the component will automatically switch to demo mode using sample data, indicated by a "Demo Mode" badge.

## Technologies Used

- React 18
- TypeScript
- React Router DOM
- Bootstrap 5
- React Bootstrap
- React Bootstrap Icons
