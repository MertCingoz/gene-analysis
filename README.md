# Gene Analysis

## Overview
This project is a web application with a React frontend and Node.js backend. It provides data visualization and analysis capabilities for omics data.

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Hono** - Lightweight web framework
- **SQLite** - Database engine
- **Drizzle ORM** - Database ORM
- **Zod** - Schema validation

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Material UI (MUI)** - Component library
- **MUI X Charts & Data Grid** - Data visualization components
- **Axios** - HTTP client

## Prerequisites
- Docker and Docker Compose

## Getting Started

### Environment Variables
The project uses the following environment variables (defined in `.env`):
- `NODE_IMAGE`: Node.js Docker image to use
- `BACKEND_HOST`: Host for the backend service
- `BACKEND_PORT`: Port for the backend service
- `API_URL`: URL for API requests
- `FRONTEND_PORT`: Port for the frontend service

### Running the Application

#### Development Mode
To run the project in development mode:

```shell
docker compose -f compose.dev.yml up
```

This will:
- Start the backend server on port 4000
- Start the frontend development server on port 5000
- Mount local directories to enable hot reloading

Development workflow:
1. Clone the repository
2. Start the development environment with the command above
3. Access the frontend at http://localhost:5000
4. Access the API at http://localhost:4000/api

#### Production Mode
To run the project in production mode:

```shell
docker compose up
```

This will:
- Build optimized Docker images for both frontend and backend
- Start the backend server on port 4000
- Serve the frontend through Nginx on port 5000

To build the production images without starting the services:

```shell
docker compose build
```

This creates optimized Docker images that can be deployed to any environment that supports Docker.

> **Note:** Port 5000 might already be in use by your operating system:
> - **macOS (Monterey and later)**: Port 5000 is used by AirPlay Receiver service. You can either turn off the AirPlay Receiver or change the FRONTEND_PORT in the .env file.
> - **Windows**: Port 5000 might be used by UPnP (Universal Plug and Play) or other system services.
> 
> If you encounter a port conflict, you can change the FRONTEND_PORT in the .env file to another value (e.g., 3000).

## Project Structure
- `/backend` - Node.js backend code
  - `/src` - Source code
  - `/data` - Database and sample data
- `/frontend` - React frontend code
  - `/src` - Source code
  - `/public` - Static assets
