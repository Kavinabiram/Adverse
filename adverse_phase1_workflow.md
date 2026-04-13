# Adverse Platform -- Phase 1 Technical Workflow Documentation

## Overview

Adverse is an auto‑rickshaw digital advertising platform consisting
of: - Driver Mobile App - Tablet Display App - Admin Web Panel - Backend
API & Database

Tablet displays advertisements inside autos and collects analytics
like: - Ad view duration - GPS route coverage - Viewer interaction -
Feedback (like / dislike) - Location clicks

Tablet works **offline**, and sync happens using **Wi‑Fi between Driver
App and Tablet**.

------------------------------------------------------------------------

# System Architecture

Driver App\
↓ Wi‑Fi / Hotspot Sync\
Tablet App\
↓\
Backend API\
↓\
Database\
↓\
Admin Panel

------------------------------------------------------------------------

# Database Schema

## Users

``` sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  auth_uid VARCHAR UNIQUE NOT NULL,
  role VARCHAR NOT NULL,
  name VARCHAR,
  phone VARCHAR UNIQUE,
  email VARCHAR,
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Drivers

``` sql
CREATE TABLE drivers (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  auto_number VARCHAR,
  driver_code VARCHAR UNIQUE,
  franchise_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Tablets

``` sql
CREATE TABLE tablets (
  id UUID PRIMARY KEY,
  tablet_uid VARCHAR UNIQUE NOT NULL,
  assigned_driver_id UUID REFERENCES drivers(id),
  status VARCHAR DEFAULT 'active',
  last_seen_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Zones

``` sql
CREATE TABLE zones (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  city VARCHAR,
  state VARCHAR,
  zone_code VARCHAR UNIQUE,
  created_at TIMESTAMP
);
```

## Geo Fences

``` sql
CREATE TABLE zone_geofences (
  id UUID PRIMARY KEY,
  zone_id UUID REFERENCES zones(id),
  name VARCHAR,
  polygon JSON,
  created_at TIMESTAMP
);
```

## Driver Zones

``` sql
CREATE TABLE driver_zones (
  id UUID PRIMARY KEY,
  driver_id UUID REFERENCES drivers(id),
  zone_id UUID REFERENCES zones(id),
  is_primary BOOLEAN DEFAULT FALSE
);
```

## Ad Companies

``` sql
CREATE TABLE ad_companies (
  id UUID PRIMARY KEY,
  type VARCHAR,
  name VARCHAR,
  contact_person VARCHAR,
  phone VARCHAR,
  email VARCHAR,
  address TEXT,
  created_at TIMESTAMP
);
```

## Company Zones

``` sql
CREATE TABLE ad_company_zones (
  id UUID PRIMARY KEY,
  ad_company_id UUID REFERENCES ad_companies(id),
  zone_id UUID REFERENCES zones(id)
);
```

## Advertisements

``` sql
CREATE TABLE ads (
  id UUID PRIMARY KEY,
  ad_company_id UUID REFERENCES ad_companies(id),
  title VARCHAR,
  description TEXT,
  contact_name VARCHAR,
  contact_phone VARCHAR,
  contact_email VARCHAR,
  website_url VARCHAR,
  location_name VARCHAR,
  location_lat DECIMAL,
  location_lng DECIMAL,
  google_maps_url VARCHAR,
  type VARCHAR,
  file_url TEXT,
  duration_seconds INT,
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMP
);
```

## Ad Assignments

``` sql
CREATE TABLE ad_assignments (
  id UUID PRIMARY KEY,
  ad_id UUID REFERENCES ads(id),
  zone_id UUID REFERENCES zones(id),
  start_date DATE,
  end_date DATE
);
```

## Ad Play Logs

``` sql
CREATE TABLE ad_play_logs (
  id UUID PRIMARY KEY,
  ad_id UUID REFERENCES ads(id),
  tablet_id UUID REFERENCES tablets(id),
  played_at TIMESTAMP,
  duration_played INT,
  latitude DECIMAL,
  longitude DECIMAL
);
```

## Ad Interactions

``` sql
CREATE TABLE ad_interactions (
  id UUID PRIMARY KEY,
  ad_id UUID REFERENCES ads(id),
  tablet_id UUID REFERENCES tablets(id),
  type VARCHAR,
  created_at TIMESTAMP
);
```

## Tamper Events

``` sql
CREATE TABLE tamper_events (
  id UUID PRIMARY KEY,
  tablet_id UUID REFERENCES tablets(id),
  type VARCHAR,
  reported_at TIMESTAMP
);
```

------------------------------------------------------------------------

# Admin APIs

## Driver Management

### Create Driver

POST /admin/drivers

``` json
{
  "name": "Driver Name",
  "phone": "9876543210",
  "auto_number": "KL01AB1234"
}
```

### Assign Tablet

POST /admin/tablets/assign

``` json
{
  "tablet_id": "uuid",
  "driver_id": "uuid"
}
```

### Activate or Deactivate Tablet

PATCH /admin/tablets/status

------------------------------------------------------------------------

## Advertisement Management

### Upload Advertisement

POST /admin/ads

Form fields: title, description, file, duration, zone_ids

### Push Ads to Tablets

POST /admin/ads/push

``` json
{
  "zone_id": "uuid"
}
```

------------------------------------------------------------------------

# Driver Mobile App APIs

### Login

POST /driver/login

Phone OTP authentication.

### Connect Tablet

POST /driver/tablet/connect

### Upload GPS Data

POST /driver/gps

``` json
{
  "lat": 9.9,
  "lng": 76.2
}
```

### Sync Tablet Data

POST /driver/tablet/sync

Uploads: - play logs - interactions - tamper alerts

------------------------------------------------------------------------

# Tablet App APIs

### Download Ads

GET /tablet/ads

Returns advertisement list and media files.

### Send Interaction

POST /tablet/interaction

``` json
{
  "ad_id": "uuid",
  "type": "like"
}
```

### Send Tamper Alert

POST /tablet/tamper

``` json
{
  "type": "charger_removed"
}
```

### Upload Playback Logs

POST /tablet/play-logs

``` json
{
  "ad_id": "uuid",
  "duration": 30
}
```

------------------------------------------------------------------------

# Driver ↔ Tablet Sync Workflow

1.  Driver opens the mobile app
2.  Driver app enables hotspot
3.  Tablet connects to driver hotspot
4.  Sync starts automatically

Data synced: - Advertisement updates - Playback logs - Interaction
logs - Tamper alerts - GPS routes

Tablet continues offline playback until next sync.

------------------------------------------------------------------------

# Reporting Features

Admin panel provides:

-   Route coverage heatmaps
-   Distance traveled
-   Ad view duration
-   Estimated viewer count
-   Location click rate
-   Feedback counts

Reports can be exported as **PDF or images for clients**.

------------------------------------------------------------------------
