# Data Collection Verge

A modern full-stack web application for collecting, managing, and viewing staff data submissions. Built with React (Vite), Express, MongoDB, and Cloudinary for file uploads.

## Features

- Multi-step form for staff data collection
- File upload (CV) with Cloudinary integration
- Admin dashboard for viewing, filtering, and downloading submissions
- Responsive and modern UI
- Modal-based feedback and navigation
- Secure backend with CORS and validation

## Tech Stack

- Frontend: React (Vite), Tailwind CSS
- Backend: Express, MongoDB (Mongoose)
- File Uploads: Cloudinary

## Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/0tieno/data-collection-verge.git
   cd data-collection-verge
   ```
2. **Install dependencies:**
   - Frontend:
     ```bash
     cd client
     npm install
     ```
   - Backend:
     ```bash
     cd ../server
     pnpm install
     ```
3. **Environment variables:**
   - Create `.env` files in both `client` and `server` folders (see `.env.example` for reference).
4. **Run the app:**
   - Frontend:
     ```bash
     npm run dev
     ```
   - Backend:
     ```bash
     pnpm run dev
     ```

## Usage

- Access the form at `/` to submit staff data.
- Admins can view submissions at `/admin`.

## License

MIT
