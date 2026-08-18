# 🚗 Adverse — Vehicle Advertising Platform

<p align="center">
  <b>Vehicle Advertising • Driver Management • Campaign Management • Zonal Targeting</b>
</p>

<p align="center">
  A full-stack enterprise platform for managing vehicle-based advertising operations, drivers, advertising companies, campaigns, geographic zones, media assets, and operational reports.
</p>

---

# 📌 Overview

**Adverse** is a full-stack vehicle advertising management platform designed to centralize the administration of advertising campaigns displayed through vehicle-mounted devices.

The platform provides an administrative dashboard for managing:

- 🚗 Drivers
- 📢 Advertising campaigns
- 🏢 Advertising companies
- 🗺️ Geographic zones
- 📍 Zone geofences
- 📱 Tablets / vehicle devices
- 📊 Dashboard analytics
- 📈 Revenue reports
- 📝 Audit logs
- 🔐 Admin authentication
- 🪪 Driver KYC information
- 🎥 Advertisement media
- 🖼️ Video thumbnails

The application follows a modular **React + Node.js + PostgreSQL** architecture.

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │       Adverse        │
                         │ Vehicle Advertising  │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
          ┌──────────────────┐            ┌──────────────────┐
          │   React Admin    │            │  Node.js API     │
          │    Dashboard     │◄──────────►│    Backend       │
          └──────────────────┘            └────────┬─────────┘
                                                    │
                                                    ▼
                                           ┌─────────────────┐
                                           │   PostgreSQL    │
                                           │    Database     │
                                           └─────────────────┘
                                                    │
                              ┌─────────────────────┼──────────────────┐
                              │                     │                  │
                              ▼                     ▼                  ▼
                         Drivers              Companies              Ads
                              │                     │                  │
                              ▼                     ▼                  ▼
                           Tablets              Zones             Media Files
```

---

# ✨ Key Features

## 🔐 Authentication & Authorization

The platform implements JWT-based authentication with role-based access control.

### Authentication Features

- Admin login
- JWT token generation
- Protected API routes
- Admin-only operations
- User profile
- Password change
- Driver password reset
- Admin setup workflow

### Access Control

```text
                    User
                     │
                     ▼
               JWT Authentication
                     │
                     ▼
                Auth Middleware
                     │
             ┌───────┴────────┐
             │                │
          Admin            Other Roles
             │
             ▼
       Admin Operations
```

---

# 📊 Admin Dashboard

The dashboard provides an operational overview of the advertising platform.

### Dashboard Capabilities

- 📈 Dashboard statistics
- 💰 Revenue reporting
- 📢 Advertisement performance
- 📝 Audit activity
- 🚗 Driver overview
- 🏢 Company overview
- 📊 Campaign insights

Dashboard reporting APIs are exposed through the backend reporting module.

---

# 🚗 Driver Management

The Driver Management module provides complete administrative control over driver records.

### Driver Features

- Create driver
- View drivers
- View driver details
- Update driver
- Driver status management
- Vehicle assignment
- Driver profile management
- Driver password reset
- Driver KYC management

### Driver Information

Driver records can contain:

```text
Driver Name
Email
Phone
Vehicle Number
Driver Code
Status
KYC Information
License Information
Aadhaar Information
Driver Photo
Vehicle RC
```

---

# 🪪 Driver KYC Management

Adverse includes an administrative KYC workflow for driver onboarding.

### KYC Information

The driver creation workflow supports:

- Driver name
- Email
- Phone
- Vehicle number
- Aadhaar number
- License number
- License image
- Aadhaar image
- Driver photograph
- Vehicle RC image

### KYC Uploads

The backend uses multipart file upload middleware for KYC documents.

```text
Driver Registration
        │
        ▼
Basic Information
        │
        ▼
KYC Information
        │
        ▼
Document Upload
        │
        ├── License
        ├── Aadhaar
        ├── Driver Photo
        └── Vehicle RC
        │
        ▼
Driver Created
```

---

# 📢 Advertisement Management

The Advertisement module provides campaign creation and management capabilities.

### Advertisement Features

- Create advertisements
- List advertisements
- View advertisement details
- Update advertisements
- Delete advertisements
- Upload advertisement media
- Upload videos
- Upload thumbnails
- Update thumbnails
- Custom thumbnail uploads
- Advertisement status management

---

# 🎥 Media Management

Adverse supports advertisement media uploads through the backend.

### Supported Media Workflows

```text
Advertisement
      │
      ├── Poster
      │
      └── Video
            │
            ├── Upload Video
            ├── Upload Thumbnail
            └── Update Thumbnail
```

The backend uses `multer` for multipart file handling and includes video-processing dependencies such as FFmpeg.

---

# 🏢 Advertising Company Management

The Company Management module allows administrators to manage advertising partners.

### Company Features

- Register advertising company
- List companies
- View company details
- Update company
- Delete company
- Company contact information
- Website information
- Company address
- Company type

### Company Types

```text
Corporate
Local
```

---

# 🗺️ Geographic Zone Management

Adverse supports geographical targeting through zones.

### Zone Features

- Create zones
- List zones
- Edit zones
- Manage city/state information
- Zone codes
- Geographic targeting
- Zone-company relationships
- Driver-zone relationships

### Zone Structure

```text
Zone
 │
 ├── City
 ├── State
 ├── Zone Code
 │
 └── Geofence
       │
       └── Polygon Coordinates
```

---

# 📍 Geofencing

The database architecture includes support for geographic zone boundaries.

Each geofence can contain:

```text
Zone ID
Geofence Name
Polygon Coordinates
Created Date
```

This provides the foundation for location-based advertisement targeting.

---

# 📱 Tablet / Vehicle Device Management

The backend includes tablet/device management capabilities.

### Tablet Features

- Enroll tablet
- Assign tablet to driver
- Update tablet status
- Track last-seen timestamp
- Associate tablets with drivers

### Device Data

```text
Tablet UID
Assigned Driver
Status
Last Seen
Created At
```

---

# 🎯 Advertisement Targeting

Advertisements can be assigned to geographic zones.

The database supports:

```text
Advertisement
      │
      ▼
Ad Assignment
      │
      ▼
Geographic Zone
      │
      ▼
Vehicle / Tablet
```

This enables location-oriented advertising campaign management.

---

# 📍 Advertisement Location Data

Advertisements support location information including:

- Location name
- Latitude
- Longitude
- Google Maps URL

This allows advertisements to store location-aware campaign information.

---

# 📊 Advertisement Analytics

The database contains dedicated structures for tracking advertisement activity.

### Ad Play Logs

Tracks:

- Advertisement
- Tablet
- Playback time
- Duration played
- Latitude
- Longitude

### Ad Interactions

Tracks interaction types such as:

```text
Like
Dislike
Click
```

### Tamper Events

The database also supports device tamper events such as:

```text
Charger Removed
GPS Lost
```

---

# 📈 Reporting System

The backend contains dedicated reporting endpoints.

### Available Reports

- Dashboard statistics
- Audit logs
- Revenue reports
- Advertisement performance

### Reporting Architecture

```text
Admin Dashboard
      │
      ▼
Report API
      │
      ├── Dashboard
      ├── Audit
      ├── Revenue
      └── Ad Performance
      │
      ▼
PostgreSQL
```

---

# 📝 Audit Logs

Adverse includes an audit reporting workflow for administrative activity.

The frontend provides a dedicated:

```text
Audit Logs
```

interface while the backend exposes an audit reporting endpoint.

---

# 📍 Areas & Map Interface

The frontend includes a dedicated Areas module.

### Area Features

- List areas
- Create area
- Edit area
- Geographic selection
- Coordinate-based area configuration

The frontend also includes:

```text
Leaflet
React Leaflet
```

for map-based functionality.

---

# 🎨 Admin Dashboard UI

The platform uses a minimal enterprise dashboard design.

### Design Characteristics

- Minimal black-and-white visual language
- Clean administrative layout
- Sidebar navigation
- Header navigation
- Responsive pages
- Data tables
- Dashboard cards
- Charts
- Form-based management interfaces
- Dark/light theme architecture

---

# 🌓 Theme System

The React application includes a dedicated theme context.

```text
ThemeProvider
      │
      ├── Theme State
      ├── Theme Switching
      └── Global UI Theme
```

Theme-related styling is organized under:

```text
frontend/src/styles/theme.css
```

---

# 📱 Responsive Frontend

The admin dashboard is designed for different screen sizes using Tailwind CSS.

The layout includes:

```text
Desktop
Laptop
Tablet
Mobile
```

The application uses reusable layout components:

```text
Header
Sidebar
Layout
```

---

# 🧩 Frontend Architecture

```text
frontend/
│
├── src/
│   │
│   ├── components/
│   │   ├── ThumbnailUpdate.jsx
│   │   └── VideoUpload.jsx
│   │
│   ├── context/
│   │   └── ThemeContext.jsx
│   │
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Layout.jsx
│   │   └── Sidebar.jsx
│   │
│   ├── pages/
│   │   ├── ads/
│   │   ├── areas/
│   │   ├── auth/
│   │   ├── companies/
│   │   ├── dashboard/
│   │   ├── drivers/
│   │   └── reports/
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── store/
│   │   └── authStore.js
│   │
│   └── utils/
│       └── cn.js
│
├── public/
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

# ⚙️ Backend Architecture

```text
backend/
│
├── config/
│   ├── db.js
│   └── swagger.js
│
├── controllers/
│   ├── adminController.js
│   ├── adminDriver.controller.js
│   ├── adsController.js
│   ├── authController.js
│   ├── companyController.js
│   ├── driverController.js
│   ├── reportController.js
│   └── setupAdmin.controller.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   ├── upload.middleware.js
│   └── uploadMiddleware.js
│
├── models/
│   ├── adsModel.js
│   ├── companyModel.js
│   ├── driverModel.js
│   └── userModel.js
│
├── routes/
│   ├── adminRoutes.js
│   ├── adminDriver.route.js
│   ├── adsRoutes.js
│   ├── authRoutes.js
│   ├── companyRoutes.js
│   ├── driverRoutes.js
│   ├── reportRoutes.js
│   └── setupAdmin.route.js
│
├── services/
│   ├── adminService.js
│   ├── backblaze.service.js
│   ├── emailService.js
│   ├── notificationService.js
│   ├── setupAdmin.service.js
│   └── video.service.js
│
├── utils/
│   └── validators/
│
├── setup.sql
├── seed.js
├── server.js
└── package.json
```

---

# 🔌 REST API Architecture

The backend exposes modular REST API routes.

```text
/api/auth
/api/drivers
/api/companies
/api/ads
/api/reports
/api/admin
/api/admin/drivers
/api/setup-admin
```

---

# 🔐 Authentication API

```text
POST   /api/auth/login
GET    /api/auth/profile
POST   /api/auth/change-password
```

Protected endpoints use JWT authentication middleware.

---

# 🚗 Driver API

```text
GET    /api/drivers
POST   /api/drivers
GET    /api/drivers/:id
PUT    /api/drivers/:id
```

Admin-specific driver management also supports:

```text
POST   /api/admin/drivers/create
PUT    /api/admin/drivers/:id
POST   /api/admin/drivers/:id/reset-password
```

---

# 🏢 Company API

```text
GET    /api/companies
POST   /api/companies
GET    /api/companies/:id
PUT    /api/companies/:id
DELETE /api/companies/:id
```

---

# 📢 Advertisement API

```text
GET    /api/ads
POST   /api/ads
GET    /api/ads/:id
PUT    /api/ads/:id
DELETE /api/ads/:id
```

### Media APIs

```text
POST   /api/ads/upload-video
POST   /api/ads/upload-thumbnail
POST   /api/ads/update-thumbnail
```

---

# 📊 Reporting API

```text
GET /api/reports/dashboard
GET /api/reports/audit
GET /api/reports/revenue
GET /api/reports/performance
```

---

# 📱 Device Management API

Admin routes provide device management capabilities.

```text
POST   /api/admin/tablets
POST   /api/admin/tablets/assign
PATCH  /api/admin/tablets/status
```

---

# 📚 API Documentation

The backend integrates **Swagger UI** for API documentation.

API documentation is exposed through:

```text
/api-docs
```

Once the backend is running:

```text
http://localhost:5000/api-docs
```

---

# 🗄️ Database Architecture

The project uses **PostgreSQL** with UUID-based primary keys.

### Core Tables

```text
users
drivers
tablets
zones
zone_geofences
driver_zones
ad_companies
ad_company_zones
ads
ad_assignments
ad_play_logs
ad_interactions
tamper_events
revenue
invoices
```

---

# 🔗 Database Relationships

```text
Users
 │
 └── Drivers
       │
       ├── Tablets
       │
       └── Driver Zones
                    │
                    ▼
                   Zones
                    │
                    ├── Geofences
                    │
                    └── Ad Assignments
                              │
                              ▼
                             Ads
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
           Play Logs    Interactions    Revenue
```

---

# 💾 Database Setup

The database schema is provided in:

```text
backend/setup.sql
```

The setup script creates the required PostgreSQL tables and relationships.

---

# 🚀 Getting Started

## Prerequisites

Install:

```text
Node.js
npm
PostgreSQL
```

---

# 🗄️ 1. Create Database

Create a PostgreSQL database:

```sql
CREATE DATABASE vehicle_advertising;
```

---

# 🧱 2. Initialize Database

Run the schema:

```bash
psql -U postgres -d vehicle_advertising -f backend/setup.sql
```

Or execute the SQL file through your preferred PostgreSQL client.

---

# ⚙️ 3. Configure Backend

Create:

```text
backend/.env
```

Example:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=vehicle_advertising
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret
```

Use your actual database credentials and secrets.

---

# 🔧 4. Install Backend Dependencies

```bash
cd backend
npm install
```

---

# 🌱 5. Seed Initial Admin

The repository includes a seed script.

```bash
node seed.js
```

The existing project README provides the development seed credentials:

```text
Email: admin@adverse.com
Password: admin123
```

> Change default credentials before using the application in a real production environment.

---

# ▶️ 6. Start Backend

```bash
npm start
```

Development mode:

```bash
npm run dev
```

Backend runs by default on:

```text
http://localhost:5000
```

---

# 🎨 7. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

# ▶️ 8. Start Frontend

```bash
npm run dev
```

Vite will provide the development URL, typically:

```text
http://localhost:5173
```

---

# 🏗️ 9. Production Build

```bash
npm run build
```

---

# 👀 10. Preview Production Build

```bash
npm run preview
```

---

# 🔍 11. Lint Frontend

```bash
npm run lint
```

---

# 🔄 Application Flow

```text
                 Admin Login
                      │
                      ▼
              JWT Authentication
                      │
                      ▼
               Admin Dashboard
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
     Drivers      Companies        Ads
        │             │             │
        │             │             ▼
        │             │        Media Upload
        │             │             │
        └─────────────┼─────────────┘
                      │
                      ▼
                    Areas
                      │
                      ▼
                 Target Zones
                      │
                      ▼
              Reports & Analytics
                      │
                      ▼
                  Audit Logs
```

---

# 🧠 Engineering Highlights

### 🔐 JWT + RBAC

Protected administrative operations are secured using JWT authentication and admin role middleware.

### 🗄️ PostgreSQL

Relational data is modeled using UUID-based entities and foreign-key relationships.

### 📢 Modular Advertisement Management

Advertisement creation, editing, deletion, media upload, and thumbnail management are separated into dedicated API routes and controllers.

### 🪪 KYC Workflow

Driver onboarding supports identity and vehicle document uploads.

### 🗺️ Geographic Targeting

Zones, geofences, driver-zone mappings, and advertisement-zone assignments provide a foundation for location-based campaigns.

### 📊 Reporting Layer

Dashboard, revenue, performance, and audit APIs provide an extensible reporting architecture.

### 📚 Swagger Documentation

Backend API documentation is exposed through Swagger UI.

### 🎥 Media Processing

The backend includes FFmpeg-based video processing dependencies and dedicated video services.

### ☁️ External Media Storage

The backend contains a Backblaze B2 service integration for external media storage.

---

# 📌 Project Modules

```text
🔐 Authentication
      │
      ├── Login
      ├── Profile
      ├── Password Management
      └── RBAC

🚗 Driver Management
      │
      ├── Driver CRUD
      ├── KYC
      ├── Documents
      └── Password Reset

🏢 Company Management
      │
      ├── Corporate Companies
      ├── Local Companies
      └── Campaign Partners

📢 Advertisement Management
      │
      ├── Campaign CRUD
      ├── Video Upload
      ├── Thumbnail Management
      └── Targeting

🗺️ Geographic Management
      │
      ├── Areas
      ├── Zones
      ├── Geofences
      └── Driver-Zone Mapping

📱 Device Management
      │
      ├── Tablet Enrollment
      ├── Driver Assignment
      └── Device Status

📊 Reporting
      │
      ├── Dashboard
      ├── Revenue
      ├── Performance
      └── Audit Logs
```

---

# 🛠️ Technology Stack

## Frontend

- React 19
- Vite
- Tailwind CSS
- PrimeReact
- PrimeIcons
- Lucide React
- Zustand
- Chart.js
- React Chart.js 2
- React Router DOM
- React Leaflet
- Leaflet
- Axios

## Backend

- Node.js
- Express.js
- PostgreSQL
- `pg`
- JWT
- bcrypt
- Multer
- Joi
- Morgan
- CORS

## Media & Storage

- FFmpeg
- fluent-ffmpeg
- Backblaze B2
- Multipart uploads

## API Documentation

- Swagger
- swagger-jsdoc
- swagger-ui-express

---

# 📂 Repository Structure

```text
Adverse/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── migrations/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── utils/
│   ├── setup.sql
│   ├── seed.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── store/
│   │   ├── styles/
│   │   └── utils/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── adverse_phase1_workflow.md
└── README.md
```

---

# 📈 Future Enhancements

Potential areas for further development include:

- 📱 Vehicle tablet application
- 📍 Real-time GPS streaming
- 🗺️ Advanced geofencing
- 📊 Advanced campaign analytics
- 💰 Automated billing
- 🧾 Invoice management
- 📈 Advanced revenue dashboards
- 🔔 Real-time notifications
- 🎥 Advanced media processing pipeline
- ☁️ Scalable cloud media storage
- 👥 Expanded role-based permissions
- 📱 Driver mobile application

---

# 📌 Project Highlights

```text
🚗 Vehicle Advertising Platform
📢 Advertisement Campaign Management
🚛 Driver & Vehicle Management
🏢 Advertising Company Management
🗺️ Geographic & Zonal Targeting
📍 Geofencing Architecture
📱 Tablet Device Management
🪪 Driver KYC Management
🎥 Video & Thumbnail Uploads
📊 Revenue & Performance Reports
📝 Audit Logs
🔐 JWT Authentication
👥 Role-Based Access Control
🗄️ PostgreSQL Database
📚 Swagger API Documentation
⚡ React + Node.js Architecture
```

---

# 🎯 Product Vision

Adverse is designed to bring **vehicle-based advertising operations into a centralized digital platform**.

The long-term platform architecture connects:

```text
Advertising Companies
        │
        ▼
Campaign Management
        │
        ▼
Geographic Targeting
        │
        ▼
Vehicle / Tablet Network
        │
        ▼
Advertisement Playback
        │
        ▼
Interaction & Playback Data
        │
        ▼
Analytics & Reporting
        │
        ▼
Business Insights
```

---

# 📄 License

This project is currently a private development project.

---

<p align="center">

### 🚗 Adverse

**Vehicle Advertising • Smart Targeting • Better Campaign Management**

Built with React, Node.js & PostgreSQL.

</p>
