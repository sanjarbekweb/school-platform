# School Platform

A production-oriented school website and content management platform built with **Next.js 15**, **React 19**, **Payload CMS 3**, and **TypeScript**.

The project combines the public website and administrative CMS in one modular application. It supports multilingual school content, role-based editorial workflows, media management, backups, health checks, and migration from WordPress. SQLite provides a zero-configuration local setup, while PostgreSQL is recommended for production.

## Highlights

- Public pages for news, announcements, staff, awards, galleries, magazines, education, and school information
- Integrated Payload CMS admin panel at `/admin`
- Uzbek, Russian, and English language support
- Role-based access for administrators, editors, and teachers
- Draft and publishing workflows with content versions
- Responsive design, dark mode, smooth motion, print support, and accessible navigation
- Search, pagination, redirects, breadcrumbs, and SEO metadata
- Local media management with a path to S3-compatible storage
- SQLite for development and PostgreSQL for production
- Built-in backup, restore, system verification, and health-check tooling
- WordPress migration scripts with a dry-run mode

## Technology

| Area | Stack |
| --- | --- |
| Application | Next.js 15 App Router, React 19, TypeScript |
| CMS | Payload CMS 3, Lexical rich-text editor |
| Database | SQLite locally, PostgreSQL in production |
| UI | CSS, Framer Motion, Lenis, Lucide React |
| Validation and testing | ESLint, Playwright, custom verification scripts |
| Package manager | pnpm |

## Requirements

- Node.js 20 or 22
- pnpm 9 or newer
- PostgreSQL 16 for production, or SQLite for local development

## Quick start

```bash
git clone https://github.com/sanjarbekweb/school-platform.git
cd school-platform
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

Open:

- Website: [http://localhost:3000](http://localhost:3000)
- Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)
- Health endpoint: [http://localhost:3000/api/health](http://localhost:3000/api/health)

On Windows PowerShell, copy the environment template with:

```powershell
Copy-Item .env.example .env
```

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `PAYLOAD_SECRET` | Yes | Secret used to sign Payload sessions and tokens. Use a random value of at least 32 characters in production. |
| `DATABASE_URI` | Yes | Database connection string, such as `file:./school.db` or a PostgreSQL URI. |
| `NEXT_PUBLIC_SERVER_URL` | Yes | Public origin of the application, without a trailing slash. |
| `NODE_ENV` | Yes | Use `development` locally and `production` when deployed. |
| `REVALIDATE_SECRET` | Recommended | Dedicated secret for protected cache-revalidation requests. |

Generate a production secret with Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Never commit `.env`, database files, uploaded private media, or backup archives. The repository's `.gitignore` excludes these files by default.

## Available commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Run the production build |
| `pnpm lint` | Run the Next.js ESLint checks |
| `pnpm generate:types` | Regenerate Payload CMS types |
| `pnpm verify` | Run the system verification suite |
| `pnpm seed:demo` | Add local demonstration content and users |
| `pnpm backup` | Back up the database and local media |
| `pnpm restore` | Restore the latest local backup |
| `pnpm migrate:wp:dry` | Preview a WordPress migration |
| `pnpm migrate:wp` | Run the live WordPress migration |

> `seed:demo` creates predictable demonstration accounts. Use it only in a disposable local environment, and never retain demo credentials in a public or production deployment.

## Project structure

```text
school-platform/
├── docs/                   Architecture, operations, and editor guides
├── public/                 Static assets and service worker
├── scripts/                Verification, backup, restore, seed, and migration tools
└── src/
    ├── access/             Payload access-control policies
    ├── app/
    │   ├── (admin)/        Custom administration interface
    │   ├── (frontend)/     Public website routes
    │   ├── (payload)/      Payload API route
    │   └── api/            Authentication, health, uploads, and revalidation
    ├── collections/        Payload content collections
    ├── components/         Public and administration UI components
    ├── globals/            Global CMS configuration
    └── lib/                Data, authentication, validation, and utility modules
```

## Content model and permissions

The CMS includes collections for news, blog posts, notices, staff, awards, albums, magazines, pages, redirects, media, and users. Server-side access checks protect all mutations and unpublished content.

The main roles are:

- **Admin:** full user, content, settings, and publication management
- **Editor:** editorial content management within assigned permissions
- **Teacher:** limited access to the teacher's associated content and profile

Authorization is enforced on the server. Hiding controls in the interface is not treated as a security boundary.

## Data and media

Local development uses SQLite by default:

```env
DATABASE_URI=file:./school.db
```

For production, configure PostgreSQL:

```env
DATABASE_URI=postgresql://user:password@host:5432/school_platform
```

Uploaded files are stored locally under `public/media/`. Production deployments using local storage must mount this directory on persistent storage and include it in off-site backups. An S3-compatible adapter is the preferred next step when media volume or horizontal scaling demands it.

## Backup and recovery

Create a database and media backup:

```bash
pnpm backup
```

Restore the newest available backup and verify the recovered system:

```bash
pnpm restore
pnpm verify
```

Backups are written to `backups/`, which is intentionally excluded from Git. Copy production backups to encrypted off-site storage and rehearse restoration regularly.

## Production checklist

1. Configure PostgreSQL and a unique `PAYLOAD_SECRET` and `REVALIDATE_SECRET`.
2. Set `NEXT_PUBLIC_SERVER_URL` to the HTTPS production origin.
3. Mount persistent storage for uploaded media, or configure object storage.
4. Run `pnpm install --frozen-lockfile`, `pnpm verify`, and `pnpm build`.
5. Run the application behind NGINX, Cloudflare, or another TLS-terminating reverse proxy.
6. Supervise the Node.js process with Docker, systemd, or PM2.
7. Monitor `GET /api/health` and alert on repeated failures.
8. Schedule database and media backups, then copy them off-site.
9. Remove or rotate every demonstration account and credential before launch.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Operations and security](docs/OPERATIONS-AND-SECURITY.md)
- [Editor guide (Uzbek)](docs/EDITOR-GUIDE-UZ.md)
- [Migration report](docs/MIGRATION-REPORT.md)
- [Performance and accessibility](docs/PERFORMANCE-ACCESSIBILITY.md)
- [Verification report](docs/VERIFICATION-REPORT.md)
- [Media sources](docs/MEDIA_SOURCES.md)

## Contributing

Create a focused branch, keep secrets and generated artifacts out of Git, and verify changes before opening a pull request:

```bash
pnpm lint
pnpm verify
pnpm build
```

Commit messages should explain the intent of the change, and pull requests should include verification notes for any affected public or administrative flow.

## License

No open-source license has been declared. Unless a license is added, all rights are reserved by the repository owner.
