# GreenFields Agriculture Website

A modern, full-stack agricultural company website built with React, FastAPI, and PostgreSQL. Features a public-facing corporate site with product catalog, blog, gallery, and contact form, plus a protected admin dashboard for content management.

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite build tooling
- TailwindCSS with custom earth-tone design system
- React Router v6 with lazy-loaded routes
- TanStack Query (React Query) for server state
- Axios for API communication
- Zod for form validation
- Framer Motion for animations

### Backend
- FastAPI (Python 3.11)
- PostgreSQL 16
- SQLAlchemy 2.0 ORM
- Alembic migrations
- Pydantic v2 models
- JWT authentication with bcrypt

### Infrastructure
- Docker & Docker Compose
- Nginx reverse proxy
- Environment-based configuration

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git

### Setup

1. **Clone and configure:**
```bash
git clone <repository-url>
cd agri-company-website
cp .env.example .env
```

2. **Start all services:**
```bash
docker compose up --build
```

3. **Access the application:**
- Website: http://localhost (via Nginx)
- Frontend direct: http://localhost:3000
- API docs: http://localhost:8000/api/v1/docs
- Admin panel: http://localhost/admin/login

### Default Admin Credentials
- Email: `admin@greenfields.com`
- Password: `admin123`

> Change these in production via the `.env` file.

## Project Structure

```
agri-company-website/
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── api/v1/endpoints/ # API route handlers
│   │   ├── core/             # Auth, security, dependencies
│   │   ├── crud/             # Database operations
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── utils/            # File uploads, helpers
│   │   ├── config.py         # Settings
│   │   ├── database.py       # DB connection
│   │   ├── main.py           # FastAPI app
│   │   └── seed.py           # Seed data
│   ├── alembic/              # Database migrations
│   ├── Dockerfile
│   └── pyproject.toml
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── api/              # API client layer
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Utility functions
│   │   ├── styles/           # Global styles
│   │   └── App.tsx           # Router configuration
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
├── nginx/                    # Nginx configuration
│   └── nginx.conf
├── uploads/                  # File uploads directory
├── docker-compose.yml
├── .env.example
└── README.md
```

## Features

### Public Pages
- **Home** — Hero section, featured products, testimonials, certifications, CTA
- **About** — Company story, mission/vision, sustainability, team, timeline
- **Products** — Catalog with category filtering, search, pagination
- **Product Detail** — Image gallery, specifications, packaging info, inquiry button
- **Gallery** — Masonry grid with category filters and lightbox
- **Blog** — Article listing with search, individual article view
- **Contact** — Form with Zod validation, company info, map placeholder

### Admin Dashboard
- JWT-authenticated login
- Product CRUD with image uploads
- Blog post management with markdown support
- Gallery image management
- Contact inquiry viewer with read/archive/delete

### API Endpoints (`/api/v1/`)
| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/auth/login` | POST | Admin authentication |
| `/auth/me` | GET | Current user info |
| `/products` | GET, POST | Product listing & creation |
| `/products/{slug}` | GET | Product detail |
| `/products/{id}` | PUT, DELETE | Product update & delete |
| `/products/{id}/images` | POST | Upload product image |
| `/products/categories` | GET, POST | Category management |
| `/blog` | GET, POST | Blog posts |
| `/blog/{slug}` | GET | Blog post detail |
| `/gallery` | GET, POST | Gallery images |
| `/contact` | GET, POST | Contact inquiries |

## Development

### Backend development (without Docker)
```bash
cd backend
pip install poetry
poetry install
# Start PostgreSQL locally, then:
alembic upgrade head
python -m app.seed
poetry run fastapi dev app/main.py
```

### Frontend development (without Docker)
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:3000 with proxy to backend at :8000.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_USER` | agriuser | Database user |
| `POSTGRES_PASSWORD` | agripass123 | Database password |
| `POSTGRES_DB` | agridb | Database name |
| `SECRET_KEY` | (change me) | JWT signing key |
| `ADMIN_EMAIL` | admin@greenfields.com | Default admin email |
| `ADMIN_PASSWORD` | admin123 | Default admin password |

## Database

The database includes these tables:
- `users` — Admin accounts
- `products` — Product catalog with soft delete
- `product_categories` — Product categorization
- `product_images` — Multiple images per product
- `blog_posts` — Blog articles with markdown content
- `gallery_images` — Categorized gallery photos
- `contact_inquiries` — Form submissions with read/archive tracking

All tables include `created_at` and `updated_at` timestamps. Products and blog posts support soft deletion.

## Security

- Passwords hashed with bcrypt
- JWT token authentication for admin routes
- CORS configured for allowed origins
- File upload validation (type, size)
- Request validation via Pydantic

## License

Proprietary — GreenFields Agriculture
