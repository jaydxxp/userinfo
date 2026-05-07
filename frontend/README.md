# User Management System

Hey there! This is a full-stack user management dashboard I built using React, Node.js, and MongoDB. It's designed to be a clean, snappy way to handle user profiles, with a focus on a premium look and smooth interactions.

## What's inside?

*   **User Profiles**: Full CRUD (Create, Read, Update, Delete) functionality.
*   **Smart Search**: Real-time search across names and emails as you type.
*   **Status Filters**: Quickly toggle between Active and Inactive users using integrated filter chips.
*   **Image Uploads**: Support for profile pictures (handled via Base64 to keep things simple).
*   **Data Export**: A one-click button to dump the entire user list into a CSV file.
*   **Health Monitor**: A background check that keeps an eye on the server status every 10 seconds.
*   **Responsive Design**: Works great on desktops and adjusts for mobile screens.

## Tech Stack

*   **Frontend**: React (Vite), Lucide Icons, React Hot Toast (for those nice notifications).
*   **Backend**: Node.js, Express, Mongoose (MongoDB).
*   **Styling**: Pure CSS Modules—no inline styles, no bulky frameworks, just clean and modular CSS.

## Getting Started

### 1. The Backend
First, make sure you have your MongoDB URI ready in a `.env` file.

```bash
cd backend
npm install
npm run dev 
```

### 2. The Frontend
Open a new terminal and fire up the Vite dev server.

```bash
cd frontend
npm install
npm run dev
```

The app should be running at `http://localhost:5173`.

## A few notes on the build
*   **Base64 Images**: I went with Base64 for the profile pictures to avoid setting up external storage (like S3) for this version. The backend payload limit is bumped to 100MB to handle this.
*   **Validation**: There's both frontend and backend validation for things like 10-digit mobile numbers and email formats.
*   **CSS Modules**: Every component has its own `.module.css` file to keep the styles scoped and the code maintainable.

Hope you find this useful!
