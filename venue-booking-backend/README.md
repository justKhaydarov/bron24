# 🏢 Venue Booking Backend

REST API backend for a venue/spot booking application inspired by [Bron24.uz](https://bron24.uz/).  
The system provides user authentication via OTP, venue management with multi-language support, and a full booking system with admin panel.

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| Python 3.11+ | Language |
| Django 5.0+ | Web Framework |
| Django REST Framework | REST API |
| PostgreSQL 16 | Database |
| Redis 7 | Cache / OTP Storage |
| django-modeltranslation | i18n for model fields |
| drf-spectacular | Swagger / ReDoc API docs |
| Docker & Docker Compose | Containerization |
| SimpleJWT | JWT Authentication |

---

## ✨ Features

- **OTP Authentication** — Phone-based login with OTP via Redis (mock SMS logged to console)
- **JWT Tokens** — Access + Refresh token flow
- **Rate Limiting** — Max 3 OTP requests per phone per 10 minutes
- **Venue Management** — Full CRUD (admin), list with pagination, filter by price, search by name
- **Multi-language** — Uzbek, Russian, English support for venue fields via `Accept-Language` header
- **Booking System** — Create, list, view, cancel bookings with overlap prevention
- **Auto Price Calculation** — Total price computed from duration × hourly rate
- **Time Validation** — Bookings only allowed 9 AM – 10 PM
- **Availability Endpoint** — Check available time slots for any venue on any date
- **Admin Panel** — Full Django admin with translation tabs, inline images, booking status management
- **Swagger UI & ReDoc** — Interactive API documentation
- **Seed Data** — Management command to populate 12 sample venues
- **Comprehensive Tests** — Auth, venue, and booking endpoint tests

---

## 🏗 Architecture

```
venue-booking-backend/
├── config/              # Django project settings
│   ├── settings.py      # Main configuration
│   ├── urls.py          # Root URL routing
│   └── wsgi.py          # WSGI entry point
├── apps/
│   ├── users/           # Custom User model, OTP auth, JWT
│   │   ├── models.py    # Phone-based User model
│   │   ├── otp.py       # OTP generation, Redis storage, verification
│   │   ├── views.py     # Auth endpoints
│   │   └── ...
│   ├── venues/          # Venue management
│   │   ├── models.py    # Venue + VenueImage models
│   │   ├── translation.py  # modeltranslation config
│   │   ├── filters.py   # Price range filters
│   │   └── ...
│   └── bookings/        # Booking system
│       ├── models.py    # Booking model with status workflow
│       ├── serializers.py  # Validation, overlap check, price calc
│       └── ...
├── docker-compose.yml   # PostgreSQL + Redis + Django
├── Dockerfile
├── requirements.txt
└── manage.py
```

---

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose **OR**
- Python 3.11+, PostgreSQL 16+, Redis 7+

### Environment Setup

```bash
cp .env.example .env
# Edit .env with your settings (defaults work for Docker)
```

### Running with Docker (Recommended)

```bash
# Build and start all services
docker-compose up --build -d

# Run migrations
docker-compose exec web python manage.py migrate

# Create superuser
docker-compose exec web python manage.py createsuperuser

# Seed sample venues
docker-compose exec web python manage.py seed_venues

# App is running at http://localhost:8000
```

### Running Locally (without Docker)

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Update .env: set POSTGRES_HOST=localhost, REDIS_URL=redis://localhost:6379/0

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Seed venues
python manage.py seed_venues

# Start development server
python manage.py runserver
```

### Running Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Creating Superuser

```bash
python manage.py createsuperuser
# Enter phone number (e.g., +998901234567) and password
```

---

## 📖 API Documentation

Once the server is running:

- **Swagger UI**: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
- **ReDoc**: [http://localhost:8000/api/redoc/](http://localhost:8000/api/redoc/)
- **OpenAPI Schema**: [http://localhost:8000/api/schema/](http://localhost:8000/api/schema/)

### Authentication Flow

1. **Send OTP**: `POST /api/auth/send-otp/` with `{"phone_number": "+998901234567"}`
2. **Check console** for the OTP code (mock SMS)
3. **Verify OTP**: `POST /api/auth/verify-otp/` with `{"phone_number": "+998901234567", "otp": "123456"}`
4. **Receive JWT tokens** (access + refresh) in the response
5. **Use access token**: Add header `Authorization: Bearer <access_token>` to requests
6. **Refresh token**: `POST /api/auth/refresh/` with `{"refresh": "<refresh_token>"}`

### Example Requests & Responses

#### Send OTP
```bash
curl -X POST http://localhost:8000/api/auth/send-otp/ \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+998901234567"}'

# Response: {"detail": "OTP sent successfully."}
```

#### Verify OTP
```bash
curl -X POST http://localhost:8000/api/auth/verify-otp/ \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+998901234567", "otp": "123456"}'

# Response:
# {
#   "access": "eyJ0eXAi...",
#   "refresh": "eyJ0eXAi...",
#   "is_new_user": true
# }
```

#### List Venues (with filters)
```bash
curl http://localhost:8000/api/venues/?min_price=100000&max_price=500000&search=зал \
  -H "Accept-Language: ru"
```

#### Create Booking
```bash
curl -X POST http://localhost:8000/api/bookings/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "venue": 1,
    "booking_date": "2026-03-15",
    "start_time": "10:00",
    "end_time": "12:00"
  }'

# Response:
# {
#   "id": 1,
#   "venue": 1,
#   "booking_date": "2026-03-15",
#   "start_time": "10:00:00",
#   "end_time": "12:00:00",
#   "total_price": "200000.00",
#   "status": "pending",
#   ...
# }
```

#### Check Availability
```bash
curl http://localhost:8000/api/venues/1/availability/?date=2026-03-15
```

---

## 🔧 Admin Panel

Access the Django admin at [http://localhost:8000/admin/](http://localhost:8000/admin/)

**Features:**
- **Venues** — Add/edit venues with translation tabs (RU, UZ, EN), inline image management
- **Bookings** — View all bookings, update status directly from list view
- **Users** — Manage users, verify/deactivate accounts

---

## 🌐 Internationalization

The API supports three languages: **Russian (ru)**, **Uzbek (uz)**, **English (en)**.

**Default language:** Russian

**How to use:** Set the `Accept-Language` header in your requests:

```bash
# Get venues in English
curl -H "Accept-Language: en" http://localhost:8000/api/venues/

# Get venues in Uzbek
curl -H "Accept-Language: uz" http://localhost:8000/api/venues/
```

**Translated fields:** venue name, address, description, amenities

---

## 🧪 Testing

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test apps.users
python manage.py test apps.venues
python manage.py test apps.bookings

# With Docker
docker-compose exec web python manage.py test
```

**Test coverage includes:**
- OTP send/verify flow
- JWT token generation and refresh
- User profile get/update
- Venue listing, filtering, searching
- Venue availability checking
- Booking creation with price calculation
- Double-booking prevention
- Time validation (9 AM – 10 PM)
- Booking cancellation rules
- User isolation (can't see/cancel others' bookings)
- Authentication enforcement

---

## 🤖 AI Tools Used

- **GitHub Copilot (Claude)** — Used for generating the entire project structure, models, serializers, views, tests, seed data, Docker configuration, and documentation
- **Tasks assisted:** Architecture design, boilerplate generation, test case creation, seed data with multi-language content, README documentation
- **Evaluation:** AI significantly accelerated the scaffolding and boilerplate phase, allowing focus on business logic correctness and edge cases

---

## 📋 API Endpoints Summary

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/send-otp/` | ❌ | Send OTP to phone number |
| POST | `/api/auth/verify-otp/` | ❌ | Verify OTP → get JWT tokens |
| POST | `/api/auth/refresh/` | ❌ | Refresh access token |
| GET | `/api/auth/me/` | ✅ | Get current user profile |
| PATCH | `/api/auth/me/` | ✅ | Update user profile |

### Venues
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/venues/` | ❌ | List venues (paginated, filterable) |
| GET | `/api/venues/{id}/` | ❌ | Venue details |
| GET | `/api/venues/{id}/availability/?date=YYYY-MM-DD` | ❌ | Available time slots |

### Bookings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/bookings/` | ✅ | List user's bookings |
| POST | `/api/bookings/` | ✅ | Create booking |
| GET | `/api/bookings/{id}/` | ✅ | Booking details |
| PATCH | `/api/bookings/{id}/cancel/` | ✅ | Cancel booking |

### Documentation
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/docs/` | Swagger UI |
| GET | `/api/redoc/` | ReDoc |
| GET | `/api/schema/` | OpenAPI JSON schema |
