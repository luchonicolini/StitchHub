<div align="center">

# STITCHHUB

### Hand-picked UI prompts, code and inspiration for humans.

[![Live on Vercel](https://img.shields.io/badge/Live_on_Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://stitch-hub-one.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)

[Explore the live app](https://stitch-hub-one.vercel.app) · [Report a bug](https://github.com/luchonicolini/StitchHub/issues) · [Request a feature](https://github.com/luchonicolini/StitchHub/issues)

</div>

![StitchHub homepage](public/screenshots/homepage.png)

## About the project

StitchHub is a community-driven gallery for discovering and sharing interface designs. Each publication can combine the finished visual, the prompt that inspired it and the code used to build it, giving designers and developers a practical source of inspiration instead of another image-only feed.

The product uses a bold neo-brutalist visual language with high contrast, strong borders, offset shadows and playful motion.

## Highlights

- Browse a responsive masonry feed of community designs.
- Share prompts, source snippets and multi-image galleries.
- Search and filter publications by category.
- Create an account and manage a public creator profile.
- Like, save, pin and edit designs.
- Follow creators and receive realtime notifications.
- Upload profile and project images through Supabase Storage.
- Use the complete experience across desktop and mobile.

## Built with

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 with App Router |
| Interface | React 19, Tailwind CSS 4 |
| Language | TypeScript |
| Backend | Supabase Postgres |
| Authentication | Supabase Auth and SSR |
| Media | Supabase Storage and Next.js Image |
| Realtime | Supabase Realtime |
| Motion | Framer Motion |
| Icons | Lucide React |
| Hosting | Vercel |

## Project structure

```text
src/
├── app/          # Routes, layouts and server-rendered pages
├── components/   # Auth, profile, workshop and reusable UI
├── data/         # Local fallback and promotional content
├── hooks/        # Authentication, filtering and toast state
├── lib/          # Supabase, uploads and design submission
└── types/        # Database and UI domain models
```

## Getting started

### Requirements

- Node.js 20.9 or newer
- npm
- A Supabase project

### Installation

```bash
git clone https://github.com/luchonicolini/StitchHub.git
cd StitchHub
npm install
```

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

Only use a Supabase publishable or legacy `anon` key in a `NEXT_PUBLIC_` variable. Never expose a `service_role` key in the browser.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Check the codebase with ESLint |

## Database setup

The repository includes SQL scripts for profiles, followers and notifications. Review them before running them in the Supabase SQL Editor, and keep Row Level Security enabled for every table exposed through the Data API.

For authentication callbacks, add both local and production URLs to the Supabase redirect allow list:

```text
http://localhost:3000/auth/callback
https://stitch-hub-one.vercel.app/auth/callback
```

## Deployment

The public application is deployed on Vercel from the `main` branch. Configure these variables in the Vercel project for every required environment:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Every push to `main` triggers a new production deployment.

## Contributing

Issues and pull requests are welcome. Before submitting a change:

1. Create a branch from `main`.
2. Keep the change focused and document its purpose.
3. Run `npm run lint` and `npm run build`.
4. Open a pull request with screenshots for visual changes.

## Author

Created and maintained by [@luchonicolini](https://github.com/luchonicolini).

---

<div align="center">
  <strong>Designed with bold strokes, thick borders and a little controlled chaos.</strong>
</div>
