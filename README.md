# Shortly — URL Shortener

A full-stack URL shortener with Redis caching, custom aliases, expiry, and click analytics.

**Stack:** Node.js · Express · MongoDB · Redis · React · Recharts

---

## Features
- Shorten any URL with a single click
- Custom aliases (`/my-link`)
- Link expiry (1hr / 24hr / 7 days / 30 days)
- Redis caching for fast redirects (~80% latency reduction)
- Click analytics dashboard with 7-day chart
- Rate limiting on all endpoints

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally (or MongoDB Atlas URI)
- Redis running locally (optional — app degrades gracefully without it)

---

### Backend Setup

```bash
cd server
npm install
cp .env.example .env     # Fill in your values
npm run dev              # Runs on http://localhost:5000
```

**Environment variables (`.env`):**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/urlshortener
REDIS_URL=redis://localhost:6379
BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000
```

---

### Frontend Setup

```bash
cd client
npm install
npm start                # Runs on http://localhost:3000
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/shorten` | Create a short URL |
| `GET` | `/:code` | Redirect to original URL |
| `GET` | `/api/shorten/:code/stats` | Get click analytics |

### POST `/api/shorten`
```json
{
  "originalUrl": "https://example.com/very/long/url",
  "customAlias": "my-link",   // optional
  "expiresIn": "24"           // optional, in hours
}
```

---

## Project Structure

```
url-shortener/
├── server/
│   ├── config/
│   │   └── redis.js          # Redis client
│   ├── middleware/
│   │   └── rateLimiter.js    # Rate limiting
│   ├── models/
│   │   ├── Url.js            # URL document schema
│   │   └── Click.js          # Click log schema
│   ├── routes/
│   │   ├── shorten.js        # POST /api/shorten, GET /api/shorten/:code/stats
│   │   └── redirect.js       # GET /:code
│   ├── index.js              # Entry point
│   └── .env.example
│
└── client/
    └── src/
        ├── components/
        │   ├── ShortenForm.jsx
        │   └── ResultCard.jsx
        ├── pages/
        │   ├── HomePage.jsx
        │   └── StatsPage.jsx
        ├── utils/
        │   └── api.js
        ├── App.jsx
        └── App.css
```

---

## Key Concepts Demonstrated
- **Redis caching** — hot URLs served from memory, not DB
- **Base62 short codes** via `nanoid`
- **TTL-based expiry** — MongoDB TTL index + Redis TTL
- **Non-blocking click logging** — redirect latency unaffected
- **Graceful degradation** — works even if Redis is down
