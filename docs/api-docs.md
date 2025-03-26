# AgriVision API Documentation

## Overview
AgriVision's API empowers farmers, researchers, and stakeholders with AI-driven agricultural insights. This documentation covers core endpoints, their usage, and response formats.

### Base URL
```
https://api.agrivision.com/v1
```

---

## Authentication

All endpoints (except `/auth/login` and `/auth/register`) require a Bearer token:

**Header:**
```
Authorization: Bearer <token>
```

### Endpoints

#### 1. Authentication

- **POST /api/auth/register**
  - Registers a new user (farmer, researcher, etc.)
  - **Body:**
  ```json
  {
    "username": "example",
    "email": "example@email.com",
    "password": "strongpassword"
  }
  ```
  - **Response:**
  ```json
  {
    "message": "User registered successfully"
  }
  ```

- **POST /api/auth/login**
  - Authenticates a user and returns a JWT token
  - **Body:**
  ```json
  {
    "email": "example@email.com",
    "password": "strongpassword"
  }
  ```
  - **Response:**
  ```json
  {
    "token": "<jwt_token>"
  }
  ```

#### 2. Farm Management

- **GET /api/farms**
  - Retrieves all farms linked to the authenticated user
  - **Response:**
  ```json
  [
    {
      "id": "1",
      "name": "Coastal Farm A",
      "location": "Mombasa",
      "size": "10 acres"
    }
  ]
  ```

- **POST /api/farms**
  - Adds a new farm
  - **Body:**
  ```json
  {
    "name": "Coastal Farm A",
    "location": "Mombasa",
    "size": "10 acres"
  }
  ```
  - **Response:**
  ```json
  {
    "message": "Farm added successfully"
  }
  ```

#### 3. AI Predictions

- **POST /api/ai/predict**
  - Submits data for AI model analysis
  - **Body:**
  ```json
  {
    "soilMoisture": 23,
    "temperature": 30,
    "salinity": 15
  }
  ```
  - **Response:**
  ```json
  {
    "prediction": "High risk of soil salinity increase"
  }
  ```

---

## Error Codes
| Code | Description          |
|------|----------------------|
| 400  | Bad Request          |
| 401  | Unauthorized         |
| 404  | Not Found            |
| 500  | Internal Server Error|

---

## WebSocket Support

**Endpoint:**
```
wss://api.agrivision.com/v1/graphql
```
- Supports real-time updates for farm data changes and AI alerts.

---

## Contact
For support, contact **support@agrivision.com**.