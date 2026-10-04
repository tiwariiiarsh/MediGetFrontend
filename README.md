# MediGet — Frontend

MediGet helps people find medicines at nearby pharmacies, and gives pharmacy owners (sellers) a dashboard to manage their shop, stock, billing and sales.

This repo is the React frontend. The Spring Boot backend lives in a separate repo (`MediGetBackend`).

**Live:** https://medigetfrontend.onrender.com

## Features

**For users**
- Search medicines and see which nearby shops have them (location + radius based)
- View alternatives for a medicine
- Shop detail page with available stock
- Sign up / log in (JWT based)
- Light / dark theme

**For sellers**
- Create and manage your pharmacy shop
- Add, edit and remove medicines
- Billing
- Sales analytics with charts

## Tech stack

| Area | Tools |
|------|-------|
| Framework | React 19, Vite |
| Routing | React Router 7 |
| State | Redux Toolkit, React Redux |
| HTTP | Axios (JWT attached automatically) |
| Styling | Tailwind CSS 4, MUI |
| Forms | React Hook Form |
| Charts | Recharts |
| Animation | GSAP, Swiper, react-parallax-tilt |
| Notifications | react-hot-toast, react-toastify |
| Contact form | EmailJS |

## Getting started

### Prerequisites
- Node.js 20+
- The MediGet backend running locally (default `http://localhost:8080`) or a deployed backend URL

### Setup

```bash
git clone https://github.com/tiwariiiarsh/MediGetFrontend.git
cd MediGetFrontend
npm install
```

Create a `.env` file in the project root:

```env
VITE_BACK_END_URL=http://localhost:8080
VITE_FRONTEND_URL=http://localhost:5173
```

> Don't put a trailing `/` on the backend URL (the app strips it anyway).

### Run

```bash
npm run dev       # start dev server at http://localhost:5173
npm run build     # production build into dist/
npm run preview   # preview the production build
npm run lint      # run ESLint
```

## Project structure

```
src/
├── api/          # Axios instance + BACKEND_URL
├── components/   # Navbar, Footer, modals, UI pieces
├── pages/        # Home, Login, Signup, Medicines, ShopDetails, About, Contact
│   └── seller/   # Seller dashboard, medicines, billing, analytics
├── shared/       # Inputs, loaders, spinners
├── store/        # Redux actions, reducers and store
├── assets/ image/
├── App.jsx       # Routes
└── main.jsx      # Entry point
```

## Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/login`, `/signup` | Auth |
| `/medicines` | Search medicines |
| `/shop/:shopId` | Shop details |
| `/about`, `/contact` | Info pages |
| `/seller` | Seller dashboard |
| `/seller/medicines` | Manage medicines |
| `/seller/billing` | Billing |
| `/seller/analytics` | Analytics |

## Deployment (Render static site)

| Setting | Value |
|---------|-------|
| Build command | `npm install; npm run build` |
| Publish directory | `dist` |
| Env variable | `VITE_BACK_END_URL=https://mediget.onrender.com` |
| Rewrite rule | `/*` → `/index.html` (so routes like `/login` work on refresh) |

The backend must allow this frontend's origin through its `FRONTEND_URL` env variable, otherwise requests fail with a CORS error.

## CI (GitHub Actions)

Workflows live in `.github/workflows/`. Render deploys the site automatically on every push to `main`.

## Full stack with Docker

The backend repo ships a `docker-compose.yml` that runs PostgreSQL and the API together. To run the whole app locally:

```bash
# in MediGetBackend
cp .env.example .env && docker compose up -d --build   # API on :8080

# in MediGetFrontend
npm install && npm run dev                              # UI on :5173
```

See the [backend README](https://github.com/tiwariiiarsh/MediGet) for the pipeline, Docker and API details.

## Notes
- File imports are case-sensitive on Linux (Render), so import paths must match file names exactly.
