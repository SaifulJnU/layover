<div align="center">

# Layover

**AI-powered travel planning for every adventurer**

Plan trips · Track budgets · Split expenses · Discover destinations

<br />

> **Prototype notice:** This is a UI/UX design prototype backed by in-memory mock data.
> Authentication, payments, and database persistence are not implemented.

</div>

---

## Screenshots

<p align="center">
  <img src="screenshots/Screenshot 2026-04-18 at 20.19.04.png" width="380" alt="Home" />
  <img src="screenshots/Screenshot 2026-04-18 at 20.19.17.png" width="380" alt="Explore" />
</p>
<p align="center">
  <img src="screenshots/Screenshot 2026-04-18 at 20.20.06.png" width="380" alt="Trip Planner" />
  <img src="screenshots/Screenshot 2026-04-18 at 20.20.50.png" width="380" alt="Budget Planner" />
</p>
<p align="center">
  <img src="screenshots/Screenshot 2026-04-18 at 20.21.19.png" width="380" alt="Split Expenses" />
  <img src="screenshots/Screenshot 2026-04-18 at 20.21.55.png" width="380" alt="Outfits" />
</p>
<p align="center">
  <img src="screenshots/Screenshot 2026-04-18 at 20.22.24.png" width="380" alt="Rewards" />
  <img src="screenshots/Screenshot 2026-04-18 at 20.22.48.png" width="380" alt="Social Feed" />
</p>
<p align="center">
  <img src="screenshots/Screenshot 2026-04-18 at 20.23.03.png" width="380" alt="Pricing" />
  <img src="screenshots/Screenshot 2026-04-18 at 20.23.27.png" width="380" alt="Dark Mode" />
</p>
<p align="center">
  <img src="screenshots/Screenshot 2026-04-18 at 20.23.48.png" width="380" alt="Weather Analysis" />
  <img src="screenshots/Screenshot 2026-04-18 at 20.24.10.png" width="380" alt="AI Itinerary" />
</p>

---

## Features

| Feature | Description |
|---|---|
| **Explore** | Browse 500+ destinations with season filters, ratings, and live weather |
| **Trip Planner** | Create trips and generate AI-powered day-by-day itineraries |
| **Budget Planner** | Set category budgets, log expenses, and track spending in real time |
| **Split Expenses** | Divide costs across your group and settle balances |
| **AI Outfit Planner** | Climate-aware packing lists based on destination and season |
| **Rewards** | Earn points on every action, climb the leaderboard, and redeem perks |
| **Social Feed** | Share trip photos and discover where others are travelling |
| **Pricing** | Free, Explorer, Pro, and Business plans |
| **Dark Mode** | Full dark/light theme with OS preference detection |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, React Router v6 |
| Icons | Lucide React |
| HTTP client | Axios |
| Backend | Go 1.21, Gin |
| Data | In-memory mock store (no database required) |
| Container | Docker + Docker Compose |
| Fonts | Plus Jakarta Sans · Inter · Pacifico |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Go](https://go.dev/) 1.21+

### Run locally (development)

**1. Clone the repository**

```bash
git clone https://github.com/your-username/layover.git
cd layover
```

**2. Start the backend**

```bash
cd backend
go run ./cmd/server
# API available at http://localhost:8080
```

**3. Start the frontend**

```bash
cd frontend
npm install
npm run dev
# App available at http://localhost:5173
```

### Run with Docker

```bash
docker compose up --build
# App available at http://localhost
```

---

## Project Structure

```
layover/
├── docker-compose.yml
├── screenshots/
│
├── frontend/                       # React + TypeScript (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── cards/              # DestinationCard, WeatherWidget
│   │   │   ├── layout/             # Navbar
│   │   │   └── ui/                 # FilterBar, InviteFriend
│   │   ├── constants/              # Route constants
│   │   ├── contexts/               # ThemeContext (dark mode)
│   │   ├── hooks/                  # useApi (generic fetch hook)
│   │   ├── pages/                  # Home, Explore, TripPlanner, Budget, …
│   │   ├── services/               # api.ts — all Axios calls
│   │   ├── types/                  # Shared TypeScript interfaces
│   │   └── utils/                  # Formatting helpers
│   ├── nginx.conf
│   ├── Dockerfile
│   └── index.html
│
└── backend/                        # Go + Gin REST API
    ├── cmd/server/main.go          # Entry point + route registration
    ├── internal/
    │   ├── handler/                # HTTP request handlers
    │   ├── middleware/             # CORS
    │   └── repository/            # In-memory mock data
    ├── pkg/model/                  # Shared domain types
    └── Dockerfile
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/destinations` | List destinations (supports filters) |
| `GET` | `/api/weather` | Current weather for a city |
| `GET` | `/api/weather/analysis` | AI travel analysis for a city |
| `GET` | `/api/trips` | List all trips |
| `POST` | `/api/trips` | Create a new trip |
| `POST` | `/api/trips/:id/generate-itinerary` | Generate an AI itinerary |
| `GET` | `/api/budget/plans` | List budget plans |
| `GET` | `/api/budget/suggestions` | Destination suggestions by budget |
| `GET` | `/api/outfits` | Outfit recommendations by destination/season |
| `GET` | `/api/social/feed` | Social feed posts |
| `GET` | `/api/rewards` | Rewards profile and history |
| `GET` | `/api/rewards/leaderboard` | Global leaderboard |
| `GET` | `/api/subscriptions/plans` | Available pricing plans |

---

## Development Notes

- The backend uses **in-memory storage** — all data resets on restart.
- The Vite dev server proxies `/api/*` to the Go backend at `localhost:8080`.
- Dark mode preference is persisted to `localStorage` under the key `layover-theme`.
- In Docker, nginx serves the built frontend and proxies `/api/*` to the backend container.

---

## License

MIT © 2026 Layover# layover
