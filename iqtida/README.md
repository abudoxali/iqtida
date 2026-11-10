# اقتداء (Iqtida) - يومك على هدي النبي ﷺ

A modern Islamic web application that helps Muslims live their daily life according to the authentic Sunnah of Prophet Muhammad ﷺ.

## Features

- **Daily Sunnah Timeline** - Sunnah practices organized by daily moments
- **Ask the Sunnah** - Ask whether the Prophet ﷺ did a certain action
- **Hadith Authenticity Checker** - Verify common religious sayings
- **Sunnah Library** - Browse and search authentic Sunnah practices
- **Forgotten Sunnahs** - Revive neglected Sunnahs
- **Progress Tracking** - Track your daily Sunnah application
- **Saved Library** - Bookmark Sunnahs, hadiths, and answers
- **Admin CMS** - Manage content with role-based access

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Auth**: NextAuth.js (Auth.js v5)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd iqtida

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and NextAuth secret

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed data (optional)
npm run db:seed

# Start development server
npm run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secret key for NextAuth |
| `NEXTAUTH_URL` | Application URL |

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login/Register pages
│   ├── (dashboard)/      # Dashboard pages (protected)
│   │   ├── dashboard/    # Main dashboard
│   │   ├── timeline/     # Daily Sunnah timeline
│   │   ├── ask/          # Ask the Sunnah
│   │   ├── verify/       # Hadith checker
│   │   ├── library/      # Sunnah library + detail
│   │   ├── saved/        # Saved items
│   │   ├── progress/     # Progress tracking
│   │   └── settings/     # User settings
│   ├── admin/            # Admin CMS
│   ├── api/              # API routes
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # shadcn UI components
│   ├── layout/           # Layout components
│   ├── sunnah/           # Sunnah-specific components
│   ├── hadith/           # Hadith-specific components
│   ├── ask/              # Ask feature components
│   ├── admin/            # Admin components
│   └── progress/         # Progress components
├── lib/
│   ├── auth.ts           # NextAuth config
│   ├── db.ts             # Prisma client
│   ├── constants.ts      # App constants
│   └── utils.ts          # Utility functions
├── types/                # TypeScript declarations
└── prisma/
    ├── schema.prisma     # Database schema
    └── seed.ts           # Seed data
```

## Religious Content Safety

This application follows strict rules:

1. Never fabricates hadith or attributes sayings to the Prophet ﷺ without source
2. Every answer includes source, grade, and evidence status
3. Distinguishes between worship (`عبادة`), habit (`عادة`), manners (`أدب`), and scholarly difference (`خلاف فقهي`)
4. Clearly marks weak and fabricated hadiths
5. Includes disclaimer: educational content, not personal fatwa
6. AI-based answers only use retrieved database content

## Content Review Status

Seed data is marked as `needs_review`. All religious content must be verified by a qualified Islamic scholar before production use.

## Deployment

GitHub Pages cannot host this app. The site needs a Node.js server (Next.js route handlers, Server Actions, NextAuth, Prisma) and PostgreSQL. Use a Node host such as Vercel, or a container host, with managed Postgres.

`auth()` in `src/lib/auth.ts` currently returns a hard-coded `ADMIN` guest for every caller. Replace that stub before any public deployment.

Environment variable names only: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`. Auth.js also accepts `NEXTAUTH_SECRET` and `NEXTAUTH_URL`. Never commit values.

Details, including why `output: 'export'` is not viable: [docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md).

## License

This project is for educational and religious purposes. Content is subject to scholarly review.

---

**اقتداء** - نسأل الله أن يرزقنا الإخلاص والاتباع
