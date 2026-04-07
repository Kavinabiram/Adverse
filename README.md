# Vehicle Advertising Platform - Admin Dashboard

A professional, minimal black-and-white themed full-stack application for managing vehicle advertisements, drivers, and advertising companies.

## Tech Stack
- **Frontend**: React (Vite), TailwindCSS, PrimeReact, Lucide icons, Zustand, Chart.js.
- **Backend**: Node.js, Express, PostgreSQL (pg).
- **Authentication**: JWT with Role-Based Access Control (RBAC).

## Getting Started

### 1. Database Setup
1. Ensure PostgreSQL is running.
2. Create a database named \`vehicle_advertising\`.
3. Run the SQL script found at \`server/setup.sql\` to initialize tables.
4. Update \`server/.env\` with your database credentials.

### 2. Backend Installation
\`\`\`bash
cd server
npm install
node seed.js  # Optional: Seed initial admin (admin@adverse.com / admin123)
npm start
\`\`\`

### 3. Frontend Installation
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`

## Key Features
- **Modern Dashboard**: Real-time stats and performance charts using Chart.js.
- **Driver Management**: Complete CRUD with status tracking and vehicle ID.
- **Ad Campaigns**: Create ads with targeting (location/age) and media upload support.
- **Company Portal**: Manage advertising partners and campaign lifecycle.
- **Zonal Targeting**: Geographical area management with mock coordinate selection.
- **Minimal Theme**: Sleek black-and-white enterprise UI with PrimeReact data tables.

## Folder Structure
- \`server/\`: Express API, PostgreSQL models, and controllers.
- \`client/\`: React application with structured components and pages.
- \`uploads/\`: Ad media storage (created automatically).