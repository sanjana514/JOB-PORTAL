# MERN Stack Job Portal

This is a full-stack job portal application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It includes a **strict TypeScript backend** and a **modern, responsive frontend** with rich UI components.

## Features

- **Frontend**

  - Built with React.js
  - Implements Radix UI for a highly customizable and accessible component library.
  - State management with Redux Toolkit and persistence with `redux-persist`.
  - Animation support using Framer Motion and TailwindCSS animations.
  - Responsive design with TailwindCSS.
  - Carousel support with `embla-carousel-react`.
  - Dynamic routing and navigation with React Router DOM.

- **Backend**
  - Built with Express.js and TypeScript (strict mode enabled).
  - JWT authentication for secure user sessions.
  - Password encryption using `bcryptjs`.
  - File uploads via `multer` and integration with Cloudinary for image hosting.
  - CORS enabled for cross-origin resource sharing.
  - Middleware for cookie parsing.
  - Real-time data validation and parsing with `datauri`.

---

## Tech Stack

### Frontend

- **Framework:** React.js (18.2.0)
- **UI Library:** Radix UI
- **Styling:** TailwindCSS, Tailwind Merge
- **State Management:** Redux Toolkit, Redux Persist
- **Animations:** Framer Motion, TailwindCSS Animate
- **Routing:** React Router DOM
- **Utilities:** Axios, clsx, sonner (notification library)

### Backend

- **Framework:** Express.js (4.21.2)
- **Language:** TypeScript (strict mode)
- **Authentication:** JSON Web Tokens (JWT)
- **Database Integration:** MongoDB
- **File Uploads:** Multer, Cloudinary
- **Middleware:** bcryptjs, cookie-parser, CORS, datauri
- **Development Tool:** Nodemon

---

## Installation

### Prerequisites

- Node.js (>= 16.0.0)
- npm or Yarn
- MongoDB instance

---
