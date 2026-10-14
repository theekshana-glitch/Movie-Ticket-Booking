# 🎬 Movie Ticket Booking System

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

> A **full-stack web application** for managing movie ticket bookings — featuring movies, shows, seat availability, customer management, bookings with CSV reports, and a mock payment workflow.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Screenshots](#-screenshots)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Security](#-security)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🎯 Overview

The **Movie Ticket Booking System** is a comprehensive web application built with the **MVC (Model-View-Controller)** architecture that allows cinema administrators to:

- Manage a catalog of movies
- Schedule shows across multiple screens
- Track real-time seat availability
- Register and manage customers
- Process ticket bookings
- Generate reports and export data to CSV
- Simulate payment workflows
- Monitor business metrics via an admin dashboard

The system uses **JWT-based authentication** with **bcrypt password hashing** for secure access control.

---

## ✨ Features

### 🎬 Movie Management
- Complete CRUD operations for movies
- Fields: title, genre, language, duration, rating, release date, description
- Search and filter capabilities

### 🎭 Show Scheduling
- Schedule shows with date, time, screen, and pricing
- Automatic seat inventory tracking
- Link shows to specific movies

### 🎟️ Seat Availability
- Real-time seat availability dashboard
- Visual occupancy indicators (color-coded progress bars)
- Filter by date
- Booked vs. Available seat counts

### 👥 Customer Management
- Full customer CRUD
- Search by name, email, or phone
- Contact information management

### 📅 Bookings System
- Create bookings with customer and show selection
- Automatic seat count reduction
- Booking status tracking (confirmed/cancelled)
- Filter bookings by date

### 📊 Bookings Report
- Date-range based report generation
- Summary statistics (total bookings, seats, revenue, cancellations)
- **CSV export** for external analysis
- Detailed booking records with payment status

### 💳 Payment Workflow
- Mock payment processing
- Multiple payment modes (cash, card, UPI, net banking)
- Payment status tracking (pending/paid/failed)
- Unique transaction reference generation
- One-click "Mark as Paid" workflow

### 📈 Admin Dashboard
- Real-time business metrics
- Total customers, movies, shows, bookings
- Today's bookings counter
- Total revenue tracker
- Pending payments alert
- Movie-wise revenue report with CSV export

### 🔐 Security
- JWT-based authentication
- bcrypt password hashing (10 salt rounds)
- Protected admin routes
- Session management
- Input validation
- SQL injection prevention (parameterized queries)
- XSS protection (HTML escaping)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| HTML5 | Semantic markup |
| CSS3 | Responsive Grid & Flexbox layouts |
| JavaScript (ES6+) | Client-side logic |
| jQuery 3.7.1 | DOM manipulation, AJAX |
| AJAX | Asynchronous API communication |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework (REST APIs) |
| JSON Web Token (JWT) | Stateless authentication |
| bcryptjs | Password hashing |
| express-session | Session management |
| cookie-parser | Cookie parsing |
| cors | Cross-Origin Resource Sharing |
| dotenv | Environment configuration |

### Database
| Technology | Purpose |
|-----------|---------|
| MySQL 8+ | Relational database |
| mysql2 | Node.js MySQL driver (Promise-based) |

### Development Tools
| Tool | Purpose |
|------|---------|
| nodemon | Auto-restart development server |
| Git | Version control |
| VS Code | Code editor |
| Postman | API testing |

---

## 🏗️ Architecture

The application follows the **MVC (Model-View-Controller)** pattern:

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                  │
│  HTML + CSS + JavaScript + jQuery + AJAX            │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP/HTTPS
                       ▼
┌─────────────────────────────────────────────────────┐
│              EXPRESS.JS SERVER (Node.js)            │
│  ┌─────────────────────────────────────────────┐   │
│  │  Routes → Middleware → Controllers          │   │
│  │  (JWT Auth, Validation)                     │   │
│  └────────────────┬────────────────────────────┘   │
│                   ▼                                 │
│  ┌─────────────────────────────────────────────┐   │
│  │           Models (Business Logic)            │   │
│  └────────────────┬────────────────────────────┘   │
└───────────────────┼─────────────────────────────────┘
                    │ SQL Queries
                    ▼
┌─────────────────────────────────────────────────────┐
│                  MySQL DATABASE                      │
│  users, movies, customers, shows, bookings,         │
│  payments                                            │
└─────────────────────────────────────────────────────┘
```

---

## 📸 Screenshots

### 🏠 Admin Dashboard
![Dashboard](screenshots/dashboard.png)
*Real-time business metrics with movie-wise revenue report*

### 🎬 Movies Management
![Movies](screenshots/movies.png)
*Complete CRUD operations for the movie catalog*

### 🎭 Shows Scheduling
![Shows](screenshots/shows.png)
*Schedule shows with automatic seat inventory*

### 🎟️ Seat Availability
![Seats](screenshots/seats.png)
*Live seat tracking with visual occupancy indicators*

### 👥 Customer Management
![Customers](screenshots/customers.png)
*Customer profiles with search functionality*

### 📅 Bookings & Reports
![Bookings](screenshots/bookings.png)
*Booking creation with date-range report generation*

### 💳 Payment Workflow
![Payments](screenshots/payments.png)
*Mock payment processing with status tracking*

> **Note:** Add your own screenshots to the `screenshots/` folder for the best presentation.

---

## 📁 Project Structure

```
movie-ticket-booking/
│
├── config/
│   └── db.js                     # MySQL connection pool
│
├── controllers/
│   ├── authController.js         # Authentication logic
│   ├── movieController.js        # Movie CRUD
│   ├── customerController.js     # Customer CRUD
│   ├── showController.js         # Show CRUD
│   ├── seatController.js         # Seat availability
│   ├── bookingController.js      # Booking + reports
│   ├── paymentController.js      # Payment workflow
│   └── dashboardController.js    # Dashboard metrics
│
├── middleware/
│   └── authMiddleware.js         # JWT + admin guard
│
├── models/
│   ├── userModel.js              # User queries
│   ├── movieModel.js             # Movie queries
│   ├── customerModel.js          # Customer queries
│   ├── showModel.js              # Show queries
│   ├── seatModel.js              # Seat queries
│   ├── bookingModel.js           # Booking + report queries
│   └── paymentModel.js           # Payment queries
│
├── routes/
│   ├── authRoutes.js
│   ├── movieRoutes.js
│   ├── customerRoutes.js
│   ├── showRoutes.js
│   ├── seatRoutes.js
│   ├── bookingRoutes.js
│   ├── paymentRoutes.js
│   └── dashboardRoutes.js
│
├── public/                        # Static frontend
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── app.js                # Shared helpers
│   │   ├── auth.js               # Auth utilities
│   │   ├── dashboard.js
│   │   ├── movies.js
│   │   ├── shows.js
│   │   ├── seats.js
│   │   ├── customers.js
│   │   ├── bookings.js
│   │   └── payments.js
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── movies.html
│   ├── shows.html
│   ├── seats.html
│   ├── customers.html
│   ├── bookings.html
│   └── payments.html
│
├── screenshots/                   # Project screenshots
│
├── .env                           # Environment variables (gitignored)
├── .gitignore
├── schema.sql                     # Database schema + seed data
├── package.json
├── server.js                      # Application entry point
└── README.md
```

---

## 🚀 Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16 or higher) — [Download](https://nodejs.org/)
- **MySQL** (v8 or higher) — [Download](https://dev.mysql.com/downloads/)
- **Git** — [Download](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/theekshana-glitch/Movie-Ticket-Booking.git
cd Movie-Ticket-Booking
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:

- `express` — Web framework
- `mysql2` — MySQL driver
- `bcryptjs` — Password hashing
- `jsonwebtoken` — JWT auth
- `express-session` — Session management
- `cookie-parser` — Cookie handling
- `cors` — Cross-origin support
- `dotenv` — Environment config

---

## ⚙️ Configuration

### Create `.env` File

Create a `.env` file in the project root:

```env
# Server
PORT=3000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=movie_booking_db

# Secrets (Change these in production!)
SESSION_SECRET=your_super_secret_session_key_change_me
JWT_SECRET=your_super_secret_jwt_key_change_me
```

> ⚠️ **Important:** Never commit the `.env` file to version control. It's already in `.gitignore`.

### `.env.example` (Recommended)

Create a `.env.example` file with placeholder values for other developers:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=movie_booking_db
SESSION_SECRET=
JWT_SECRET=
```

---

## 🗄️ Database Setup

### Step 1: Start MySQL Server

Ensure your MySQL server is running.

### Step 2: Import the Schema

```bash
mysql -u root -p < schema.sql
```

Enter your MySQL password when prompted.

This creates:
- **Database:** `movie_booking_db`
- **Tables:** `users`, `movies`, `customers`, `shows`, `bookings`, `payments`
- **Seed Data:** Admin user, 5 movies, 4 customers, 6 shows, 3 bookings, 3 payments

### Step 3: Verify Installation

```bash
mysql -u root -p -e "USE movie_booking_db; SHOW TABLES;"
```

Expected output:
```
+----------------------------+
| Tables_in_movie_booking_db |
+----------------------------+
| bookings                   |
| customers                  |
| movies                     |
| payments                   |
| shows                      |
| users                      |
+----------------------------+
```

---

## ▶️ Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

### Default Credentials

| Username | Password |
|----------|----------|
| `admin`  | `admin123` |

> ⚠️ **Security Note:** Change the default password immediately in production.

---

## 🌐 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/login` | Login and receive JWT | Public |
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/logout` | Logout user | Auth |
| `GET`  | `/api/auth/me` | Get current user | Auth |

### Movies

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET`    | `/api/movies` | List all movies | Public |
| `GET`    | `/api/movies/:id` | Get movie by ID | Public |
| `POST`   | `/api/movies` | Create movie | Admin |
| `PUT`    | `/api/movies/:id` | Update movie | Admin |
| `DELETE` | `/api/movies/:id` | Delete movie | Admin |

### Customers

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET`    | `/api/customers?search=` | List/search customers | Auth |
| `GET`    | `/api/customers/:id` | Get customer by ID | Auth |
| `POST`   | `/api/customers` | Create customer | Admin |
| `PUT`    | `/api/customers/:id` | Update customer | Admin |
| `DELETE` | `/api/customers/:id` | Delete customer | Admin |

### Shows

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET`    | `/api/shows?date=` | List shows (filter by date) | Public |
| `GET`    | `/api/shows/:id` | Get show by ID | Public |
| `POST`   | `/api/shows` | Create show | Admin |
| `PUT`    | `/api/shows/:id` | Update show | Admin |
| `DELETE` | `/api/shows/:id` | Delete show | Admin |

### Seat Availability

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/seats?date=` | Get seat availability (filter by date) | Public |
| `GET` | `/api/seats/:showId` | Get availability for specific show | Public |

### Bookings

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET`    | `/api/bookings?date=` | List bookings | Auth |
| `GET`    | `/api/bookings/:id` | Get booking by ID | Auth |
| `POST`   | `/api/bookings` | Create booking | Auth |
| `PUT`    | `/api/bookings/:id/status` | Update booking status | Auth |
| `DELETE` | `/api/bookings/:id` | Cancel booking | Auth |
| `GET`    | `/api/bookings/report?from=&to=` | Generate report | Auth |
| `GET`    | `/api/bookings/report/csv?from=&to=` | Download CSV|
 report | Auth |

### Payments

| Method | Endpoint| | Description | Auth |
|--------| id----------|-------------|------|
 || `GET` | `/api INT/payments` | List all payments | Auth |
 (| `POST` | `/api/payments` | Record payment | Auth |
| `PUT` | `/api/payments/:id/status` | Update payment status | Auth |

### Dashboard

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/dashboard/summary` | Summary metrics | Auth |
| `GET` | `/api/dashboard/report` | Movie-wise report | Auth |

---

## 🗄️ Database Schema

### `users`
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK, AI) | Primary key |
| username | VARCHAR(50) | Unique username |
| email | VARCHAR(100) | Unique email |
| password_hash | VARCHAR(255) | bcrypt hash |
| role | ENUM | 'admin' or 'staff' |
| created_at | TIMESTAMP | Auto-generated |

### `movies`
| Column | Type | Description |
|--------|------|-------------PK, AI) | Primary key |
| title | VARCHAR(150) | Movie title |
| genre | VARCHAR(80) | Genre |
| language | VARCHAR(50) | Language |
| duration_minutes | INT | Duration |
| rating | VARCHAR(10) | PG-13, R, etc. |
| release_date | DATE | Release date |
| description | TEXT | Description |

### `customers`
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK, AI) | Primary key |
| name | VARCHAR(100) | Full name |
| email | VARCHAR(100) | Unique email |
| phone | VARCHAR(20) | Phone number |
| address | VARCHAR(255) | Address |

### `shows`
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK, AI) | Primary key |
| movie_id | INT (FK) | Reference to movies |
| screen_name | VARCHAR(50) | Screen identifier |
| show_date | DATE | Show date |
| show_time | TIME | Show time |
| ticket_price | DECIMAL(10,2) | Ticket price |
| total_seats | INT | Total capacity |
| available_seats | INT | Available count |

### `bookings`
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK, AI) | Primary key |
| customer_id | INT (FK) | Reference to customers |
| show_id | INT (FK) | Reference to shows |
| seats_booked | INT | Number of seats |
| total_amount | DECIMAL(10,2) | Total cost |
| status | ENUM | 'confirmed' or 'cancelled' |
| booking_date | TIMESTAMP | Auto-generated |

### `payments`
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK, AI) | Primary key |
| booking_id | INT (FK) | Reference to bookings |
| amount | DECIMAL(10,2) | Payment amount |
| mode | ENUM | cash, card, upi, netbanking |
| status | ENUM | pending, paid, failed |
| transaction_ref | VARCHAR(100) | Unique reference |
| paid_at | TIMESTAMP | Payment timestamp |

---

## 🔒 Security

This application implements multiple security layers:

### Authentication & Authorization
- **JWT tokens** with 8-hour expiry
- **bcrypt** password hashing (10 salt rounds)
- **HTTP-only cookies** for token storage
- **Protected routes** with middleware guards
- **Role-based access control** (admin/staff)

### Input Protection
- **Parameterized SQL queries** prevent injection
- **HTML escaping** prevents XSS attacks
- **Field validation** on the server side
- **Required field checks** on the client side

### Environment Security
- **`.env` file** for sensitive data
- **`.gitignore`** prevents accidental commits
- **Separate secrets** for JWT and sessions
- **No hardcoded credentials** in source code

### Best Practices
- Change default admin password in production
- Use HTTPS in production
- Rotate JWT secrets periodically
- Enable rate limiting for public endpoints
- Regular dependency updates (`npm audit`)

---

## 🧪 Testing

### Manual Testing Workflow

1. **Login** → `admin / admin123`
2. **Movies** → Add 3+ movies
3. **Shows** → Schedule shows for each movie
4. **Customers** → Register 3+ customers
5. **Seats** → Verify live availability
6. **Bookings** → Create bookings
7. **Report** → Generate report with date range
8. **Payments** → Mark pending payments as paid
9. **Dashboard** → Verify metrics update

### API Testing with cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get movies
curl http://localhost:3000/api/movies

# Get seat availability
curl http://localhost:3000/api/seats
```

---

## 🌐 Deployment

### Recommended Platforms

| Platform | Type | Free Tier |
|----------|------|-----------|
| **Render** | Full-stack | Yes |
| **Railway** | Full-stack | Trial |
| **Vercel** | Frontend | Yes |
| **Cyclic** | Backend | Yes |

### Deploy to Render (Example)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and sign in
3. Click **"New → Web Service"**
4. Connect your GitHub repository
5. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
6. Add environment variables (from `.env`)
7. Use a managed MySQL service (e.g., [PlanetScale](https://planetscale.com/), [Railway MySQL](https://railway.app/))
8. Deploy!

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create a branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Code Style Guidelines

- Use **2-space indentation**
- Follow **camelCase** for variables/functions
- Use **PascalCase** for classes
- Write **descriptive commit messages**
- Add **comments** for complex logic

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Theekshana

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Author

**Theekshana**

- GitHub: [@theekshana-glitch](https://github.com/theekshana-glitch)
- Project: [Movie-Ticket-Booking](https://github.com/theekshana-glitch/Movie-Ticket-Booking)

---

## 🙏 Acknowledgments

- **Node.js** community for excellent documentation
- **Express.js** for the robust web framework
- **jQuery** for simplifying AJAX interactions
- **MySQL** for the reliable database engine
- All open-source contributors

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Installation](#-installation) section
2. Search [existing issues](https://github.com/theekshana-glitch/Movie-Ticket-Booking/issues)
3. Open a [new issue](https://github.com/theekshana-glitch/Movie-Ticket-Booking/issues/new)

---

## 🎯 Roadmap

- [x] Movie CRUD
- [x] Show scheduling
- [x] Customer management
- [x] Booking system
- [x] Seat availability
- [x] Payment workflow
- [x] Admin dashboard
- [x] CSV report export
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] Mobile responsive improvements
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Unit & integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline

---

<div align="center">

**⭐ Star this repository if you found it helpful! ⭐**

Made with ❤️ by [Theekshana](https://github.com/theekshana-glitch)

</div>