# Personal Portfolio Website

## Overview
A modern, fully-featured personal portfolio website built with Next.js 14, TypeScript, and a robust tech stack.

## Technology Stack
- **Frontend**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom JWT-based auth
- **Deployment**: Vercel

## Features
- Dynamic Theme System
- Admin Dashboard
- Project Showcase
- Blog Integration
- SEO Optimized
- Performance Tracking

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Vercel Account (optional)

### Installation
1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Set up environment variables
4. Run database migrations
   ```bash
   npx prisma migrate dev
   ```
5. Start development server
   ```bash
   npm run dev
   ```

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Authentication secret
- `CLOUDINARY_URL`: Image storage
- `SMTP_HOST`: Email configuration

## Deployment
Easily deployable on Vercel with zero configuration.

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License.
