# Movie Ticket Booking System

A small full-stack web app for running a cinema's back office: manage movies and showtimes, take bookings, record payments, keep a watch history, and view a revenue dashboard.

**Stack:** Node.js · Express 5 · MySQL/MariaDB (`mysql2`) · jQuery + plain HTML/CSS on the front end · JWT + bcrypt for auth.

> This is an **admin/staff tool**. There is no public customer login. Customers are "guests" identified only by name/email on a booking.

---

## Table of contents

1. [Quick start](#quick-start)
2. [Configuration (`.env`)](#configuration-env)
3. [Database](#database)
4. [How to use the app](#how-to-use-the-app)
5. [How it works](#how-it-works)
6. [API reference](#api-reference)
7. [Project structure](#project-structure)
8. [Known issues and gotchas](#known-issues-and-gotchas)
9. [Troubleshooting](#troubleshooting)

---

## Quick start

**Prerequisites:** Node.js 18+ and MySQL 8+ (or MariaDB 10.4+).

```bash
# 1. Install dependencies
npm install

# 2. Create the database and load the schema + sample data
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS movie_booking_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p movie_booking_db < database/movie_booking_db.sql

# 3. Edit .env (set DB_PASSWORD and a strong JWT_SECRET) – see below

# 4. Run
npm start          # production-style
npm run dev        # auto-reload with nodemon
```

Open <http://localhost:3000> and sign in with:

| Username | Password   |
|----------|------------|
| `admin`  | `admin123` |

> **Linux users:** if the server crashes with `Cannot find module '../middleware/authMiddleware'`, read [Known issues #1](#known-issues-and-gotchas) – it is a one-line fix.

---

## Configuration (`.env`)

The `.env` file lives in the project root and is loaded by `dotenv`.

| Variable         | Default (if unset)  | Purpose |
|------------------|---------------------|---------|
| `PORT`           | `3000`              | HTTP port |
| `DB_HOST`        | `localhost`         | MySQL host |
| `DB_USER`        | `root`              | MySQL user |
| `DB_PASSWORD`    | *(empty)*           | MySQL password |
| `DB_NAME`        | `movie_booking_db`  | Database name |
| `DB_PORT`        | –                   | Present in `.env` but **not read** by `config/db.js`; the default port 3306 is always used |
| `JWT_SECRET`     | **none – required** | Signs login tokens. If missing, every login fails |
| `SESSION_SECRET` | `secret`            | Used by `express-session`. Not in the shipped `.env`; add it |

Example:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=movie_booking_db
JWT_SECRET=use_a_long_random_string
SESSION_SECRET=another_long_random_string
```

Do not commit `.env` to version control.

---

## Database

**Use `database/movie_booking_db.sql`.** It is the schema the code actually queries, and it includes sample data.

> `database/schema.sql` is an **older, incompatible schema** (different database name `movie_booking`, different column names such as `duration`, `seats`, `password`, and no `watch_history` table). The application will not work against it. Ignore or delete it.

The dump does not contain `CREATE DATABASE`, so create `movie_booking_db` first (Quick start, step 2).

### Tables

| Table           | Key columns |
|-----------------|-------------|
| `users`         | `username` (unique), `email` (unique), `password_hash`, `role` (`admin`/`staff`) |
| `movies`        | `title`, `genre`, `language`, `duration_minutes`, `rating`, `release_date`, `description`, `poster_url` |
| `shows`         | `movie_id` → movies, `screen_name`, `show_date`, `show_time`, `ticket_price`, `total_seats`, `available_seats` |
| `bookings`      | `guest_name`, `guest_email`, `guest_phone`, `show_id` → shows, `seats_booked`, `total_amount`, `status` (`confirmed`/`cancelled`) |
| `payments`      | `booking_id` → bookings, `amount`, `mode` (`cash`/`card`/`upi`/`netbanking`), `status` (`pending`/`paid`/`failed`), `transaction_ref`, `paid_at` |
| `watch_history` | `guest_email`, `movie_id` → movies, `watched_on`, `rating`, `review` |

All foreign keys use `ON DELETE CASCADE`: deleting a movie removes its shows, their bookings, those bookings' payments, and its watch history.

### Sample data included

5 movies, 6 shows (14–16 Oct 2026), 3 bookings, 3 payments (2 paid, 1 pending), 3 history entries, and the `admin` user.

### Creating another user

There is no user-management page. Either call `POST /api/auth/register` (see [API reference](#api-reference)) or insert a row with a bcrypt hash:

```bash
node -e "console.log(require('bcryptjs').hashSync('newpassword', 10))"
```

---

## How to use the app

All pages except the landing page and login require you to be signed in; otherwise you are redirected to `login.html`.

| Page | What you do there |
|------|-------------------|
| `index.html` | Landing page with links to login/dashboard |
| `login.html` | Sign in with username + password |
| `dashboard.html` | Cards for total movies, total shows, today's bookings, total revenue, pending payments. Movie-wise report table with **Export CSV** |
| `movies.html` | Add, edit, delete movies |
| `shows.html` | Schedule showtimes: pick a movie, screen name, date, time, price, seat count |
| `bookings.html` | Create a booking (guest details + show + seat count), filter bookings by show date, cancel (delete) a booking |
| `history.html` | Record what a guest watched with rating/review; filter by guest email |
| `payments.html` | See every payment and click **Mark Paid** on pending ones |

### Typical workflow

1. **Movies** → add a movie.
2. **Shows** → create a showtime for it (`available_seats` starts equal to the seat count you enter).
3. **Bookings** → book seats for a guest. The total is `ticket_price × seats`, seats are deducted from the show, and a **pending card payment** is created automatically by the browser.
4. **Payments** → click **Mark Paid**. Revenue on the dashboard counts only `paid` payments.
5. **Watch History** → optionally log the guest's rating/review afterwards.

---

## How it works

**Request flow (MVC):** `server.js` → `routes/*` → `controllers/*` → `models/*` → MySQL pool (`config/db.js`). Controllers validate input and shape responses. Models hold all SQL and use parameterised queries.

**Authentication**
1. `POST /api/auth/login` checks the bcrypt hash and returns a JWT (8-hour expiry). The token is also set as an `httpOnly` cookie named `token`.
2. The browser stores the token in `localStorage` and sends it as `Authorization: Bearer <token>`.
3. The `authenticate` middleware accepts the token from the cookie, the `Authorization` header, or the session, then verifies it with `JWT_SECRET`.
4. `authorizeAdmin` additionally requires `role === 'admin'` (used for creating/changing movies and shows).

**Front end:** static files in `public/`, served by Express. Each page has a matching script in `public/js/`. `auth.js` holds token helpers, `app.js` renders the shared header/nav and message banners. jQuery is loaded from the jQuery CDN, so the browser needs internet access.

**Booking logic:** the booking controller checks that the show exists and that `available_seats >= seats_booked`, computes the total, inserts the booking, then subtracts the seats from the show. The payment record is created by a second API call from `booking.js` in the browser, not by the server.

---

## API reference

Base URL: `http://localhost:3000`. Bodies are JSON. "Auth" means a valid token; "Admin" means a token whose role is `admin`.

### Auth – `/api/auth`
| Method | Path | Access | Notes |
|--------|------|--------|-------|
| POST | `/login` | Public | Body: `username`, `password`. Returns `token`, `role`, `username` |
| POST | `/register` | **Public** | Body: `username`, `email`, `password`, optional `role` (defaults to `admin`; the DB only accepts `admin`/`staff`) |
| POST | `/logout` | Public | Clears the cookie |
| GET | `/me` | Auth | Returns the decoded token |

### Movies – `/api/movies`
| Method | Path | Access | Notes |
|--------|------|--------|-------|
| GET | `/` | Public | All movies, newest first |
| GET | `/:id` | Public | |
| POST | `/` | Admin | Required: `title`, `genre`, `language`, `duration_minutes`. Optional: `rating`, `release_date`, `description`, `poster_url` |
| PUT | `/:id` | Admin | Full update (send all fields) |
| DELETE | `/:id` | Admin | Cascades to shows/bookings/payments/history |

### Shows – `/api/shows`
| Method | Path | Access | Notes |
|--------|------|--------|-------|
| GET | `/?date=YYYY-MM-DD` | Public | Optional date filter; includes `movie_title`, `genre` |
| GET | `/:id` | Public | |
| POST | `/` | Admin | Required: `movie_id`, `screen_name`, `show_date`, `show_time`, `ticket_price`. Send `total_seats` too (the model does not default it) |
| PUT | `/:id` | Admin | Full update. Does **not** adjust `available_seats` |
| DELETE | `/:id` | Admin | |

### Bookings – `/api/bookings` (all require Auth)
| Method | Path | Notes |
|--------|------|-------|
| GET | `/?date=YYYY-MM-DD` | Filter by show date |
| GET | `/:id` | |
| POST | `/` | Body: `guest_name`, `guest_email`, `show_id`, `seats_booked`, optional `guest_phone`. Returns `id`, `total_amount` |
| PUT | `/:id/status` | Body: `status` (`confirmed`/`cancelled`) |
| DELETE | `/:id` | Hard delete |

### Watch history – `/api/history` (all require Auth)
| Method | Path | Notes |
|--------|------|-------|
| GET | `/?email=guest@example.com` | Optional email filter |
| POST | `/` | Required: `guest_email`, `movie_id`, `watched_on`. Optional: `rating`, `review` |
| DELETE | `/:id` | |

### Payments – `/api/payments` (all require Auth)
| Method | Path | Notes |
|--------|------|-------|
| GET | `/` | All payments with guest name |
| POST | `/` | Required: `booking_id`, `amount`. Optional: `mode` (default `card`), `status` (default `pending`). Generates `transaction_ref` like `TXN-<timestamp>` |
| PUT | `/:id/status` | Body: `status` (`pending`/`paid`/`failed`), optional `mode`. Sets `paid_at` when `paid` |

Payments are a **mock workflow**: no real payment gateway is involved.

### Dashboard – `/api/dashboard` (all require Auth)
| Method | Path | Returns |
|--------|------|---------|
| GET | `/summary` | `total_movies`, `total_shows`, `todays_bookings`, `total_revenue` (sum of paid payments), `pending_payments` |
| GET | `/report` | Per-movie `title`, `bookings`, `revenue` (from bookings), sorted by revenue |

### Quick test with curl

```bash
TOKEN=$(curl -s -X POST localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin123"}' | node -pe "JSON.parse(require('fs').readFileSync(0)).token")

curl -H "Authorization: Bearer $TOKEN" localhost:3000/api/dashboard/summary
```

---

## Project structure

```
Movie-ticket-booking/
├── server.js                 # Express app, middleware, route mounting, error handler
├── package.json              # scripts: start, dev
├── .env                      # configuration (do not commit)
├── config/
│   └── db.js                 # mysql2 connection pool
├── middleware/
│   └── authmiddleware.js     # authenticate, authorizeAdmin (see Known issues #1 re: filename)
├── routes/                   # URL → controller mapping (auth, movie, show, booking, history, payment, dashboard)
├── controllers/              # validation + response handling
├── models/                   # SQL queries (user, movie, show, booking, history, payment)
├── database/
│   ├── movie_booking_db.sql  # USE THIS: schema + sample data
│   └── schema.sql            # outdated, incompatible – ignore
└── public/                   # static front end
    ├── *.html                # index, login, dashboard, movies, shows, bookings, history, payments
    ├── css/style.css
    └── js/                   # auth, app (shared), login, dashboard, movies, shows, booking, history, payments
```

---

## Known issues and gotchas

1. **Middleware filename case (breaks on Linux).** The file is `middleware/authmiddleware.js` but every route imports `../middleware/authMiddleware`. This works on Windows and default macOS but crashes on Linux/Docker. Fix by renaming:
   ```bash
   mv middleware/authmiddleware.js middleware/authMiddleware.js
   ```
2. **Public registration creates admins.** `POST /api/auth/register` needs no login and defaults the role to `admin`. Anyone who can reach the server can make an admin account. Protect or remove it before any real deployment.
3. **Debug logging leaks secrets.** `authController.login` prints the submitted password, the stored hash and `JWT_SECRET` to the console. Remove those `console.log` lines.
4. **Error handler exposes stack traces** to clients (`server.js`). Return a generic message in production.
5. **Cancel deletes the booking and does not return seats.** The "Cancel" button calls `DELETE /api/bookings/:id`, and seats are never added back to `available_seats`. The `PUT .../status` endpoint to set `cancelled` also does not restore seats.
6. **Seat booking is not transactional.** The seat check and the seat deduction are separate queries, so simultaneous bookings could oversell a show.
7. **Payment is created by the browser**, not the server. A booking made via the API alone has no payment row.
8. **Only the admin role can edit movies and shows.** `staff` users can use bookings, history, payments and the dashboard but get 403 on movie/show changes.
9. **No customer management.** Guests exist only as fields on bookings and history entries.
10. **No automated tests** (`npm test` is a placeholder), and no input sanitising on the front end (names and descriptions are inserted into pages as HTML).
11. **Default secrets.** `SESSION_SECRET` falls back to `secret`; change the shipped `JWT_SECRET` and the `admin123` password before sharing the app.

---

## Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| `Cannot find module '../middleware/authMiddleware'` | Filename case – see Known issues #1 |
| `ER_ACCESS_DENIED_ERROR` / `ECONNREFUSED` | Wrong `DB_USER`/`DB_PASSWORD` in `.env`, or MySQL not running |
| `ER_BAD_DB_ERROR: Unknown database` | Create `movie_booking_db` and import the dump (Quick start, step 2) |
| `Unknown column 'username'` etc. | You imported `schema.sql` instead of `movie_booking_db.sql` |
| `Invalid credentials` for `admin` | Dump not imported, or `admin` row changed. Password for the sample row is `admin123` |
| Every login returns an error / "secretOrPrivateKey must have a value" | `JWT_SECRET` missing from `.env` |
| `EADDRINUSE` | Port taken; change `PORT` in `.env` |
| Pages load unstyled or blank tables | jQuery is loaded from a CDN; check your internet connection |
| Redirected back to login | Token expired (8 h) or removed; sign in again |
