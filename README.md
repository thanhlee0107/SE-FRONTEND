SmartPrinting-SSPS is a comprehensive platform designed to enhance the printing experience for students at HCMUT (Ho Chi Minh City University of Technology). It integrates advanced features for efficient printing management, providing a seamless experience for both users and administrators.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Frontend](#frontend)
4. [Backend](#backend)
5. [Installation](#installation)
6. [Usage](#usage)
7. [Contributing](#contributing)
8. [License](#license)

## Introduction

The Student Smart Printing Service (SSPS) aims to streamline the printing process for HCMUT students by providing a user-friendly platform. It allows users to upload documents, select printing options, and manage payments online. The platform also includes tools for system administrators to monitor and manage printing resources effectively.

## Features

- **User-Friendly Interface:** Simplified printing workflows for students.
- **Payment Integration:** Seamless payment options for printing services.
- **Printer Management:** Admin tools for monitoring printers and managing queues.
- **Real-Time Updates:** Track printing progress and notifications.
- **Cross-Platform Support:** Accessible from web and mobile devices.

## Frontend

The frontend is built using modern web technologies to ensure a smooth and responsive user experience.

### Technologies Used

- **Framework:** React.js
- **Styling:** Tailwind CSS
- **State Management:** Redux
- **Routing:** React Router

### Key Features

- Interactive user interface for uploading documents and selecting print options.
- Real-time updates on print job statuses.
- User account management and history tracking.

### Setup

```bash
# Navigate to the frontend directory
cd fe

# Install dependencies
npm install

# Start the development server
npm start

```

## Backend

The backend provides RESTful APIs for managing data and communication between the frontend and the database.

### Technologies Used

- **Framework:** Nodejs, Express
- **Database:** MySql
- **Authentication:** JWT
- **API Documentation:** Swagger

### Key Features

- User authentication and role-based access control.
- APIs for managing printers, jobs, and user profiles.

```bash
# Navigate to the backend directory
cd be

# Configure environment variables in the .env file
# Example:
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=yourpassword
# DB_NAME=ssps_database

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Read more in directory be
