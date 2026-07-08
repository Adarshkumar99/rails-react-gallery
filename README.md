# Rails + React Photo Gallery

A full-stack photo gallery application with a **Ruby on Rails** JSON API backend and a **React** single-page frontend. Users can create photo albums, upload images, and control album visibility, with authentication handled via JWT.

![Ruby on Rails](https://img.shields.io/badge/Rails-8-CC0000?logo=rubyonrails&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-database-336791?logo=postgresql&logoColor=white)
![Devise JWT](https://img.shields.io/badge/Auth-Devise%20JWT-3178C6)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Overview

This project is a monorepo containing two independently deployable applications: a Rails API backend that manages users, albums, and photos, and a React frontend that consumes that API. Albums can be public or private, photos are stored via Rails Active Storage with Cloudinary as the production storage backend, and authentication is stateless, token-based JWT via Devise.

---

## Features

- **Authentication**
  - Email/password sign-up and login via Devise
  - Stateless JWT authentication (`devise-jwt`) with a database-backed revocation (denylist) strategy, so logout actually invalidates the token
  - CORS configured so the React frontend can authenticate against the API from a separate origin

- **Albums**
  - Create, edit, and delete photo albums
  - Public/private visibility toggle per album — private albums are hidden from other users
  - Cover image per album
  - `my_albums` endpoint for a user's personal album dashboard, separate from the public gallery feed
  - Photo count cached on the album record (`counter_cache`) for efficient listing

- **Photos**
  - Upload photos into an album via Active Storage
  - Delete individual photos
  - Images served from Cloudinary in production

- **Frontend (React)**
  - Album gallery, album detail, create/edit album, login/signup, and user profile pages
  - Client-side routing via React Router
  - Global auth state via React Context
  - Toast notifications for user feedback (`react-hot-toast`)
  - Bootstrap-based responsive UI

---

## Tech Stack

### Backend
| Layer            | Technology                              |
|-------------------|------------------------------------------|
| Framework         | Ruby on Rails 8 (API mode)                |
| Language          | Ruby 3.2.2                                 |
| Database          | PostgreSQL                                 |
| Authentication    | Devise + devise-jwt                        |
| File Storage      | Active Storage + Cloudinary                |
| Background Jobs   | Solid Queue                                |
| Caching           | Solid Cache                                |
| Web Sockets       | Solid Cable                                |
| CORS              | rack-cors                                  |
| Containerization  | Docker                                     |
| Deployment        | Kamal                                      |
| Code Quality      | RuboCop (Omakase), Brakeman, bundler-audit |

### Frontend
| Layer            | Technology                              |
|-------------------|------------------------------------------|
| Library           | React 19                                   |
| Build Tool        | Vite                                       |
| Routing           | React Router v7                            |
| UI Framework      | Bootstrap 5                                |
| Notifications     | react-hot-toast                            |
| Linting           | ESLint                                     |
| Deployment        | Vercel                                     |

---

## Project Structure

```
rails-react-gallery/
├── backend/                       # Rails JSON API
│   ├── app/
│   │   ├── controllers/api/v1/     # Albums, Photos, and Home API endpoints
│   │   ├── models/                  # User, Album, Photo, JwtDenylist
│   │   └── views/
│   ├── config/
│   │   ├── routes.rb                 # API + Devise routes
│   │   ├── deploy.yml                 # Kamal deployment config
│   │   └── storage.yml                 # Active Storage / Cloudinary config
│   ├── db/                              # Migrations and schema
│   └── Dockerfile
└── frontend/                       # React SPA
    └── src/
        ├── api/                      # Axios/fetch API client
        ├── context/                   # AuthContext (global auth state)
        ├── pages/                      # Home, Album, AlbumDetail, CreateAlbum,
        │                                 EditAlbum, Login, Signup, UserProfile
        └── components/
```

---

## Getting Started

### Prerequisites
- Ruby 3.2.2
- Node.js 18+
- PostgreSQL

### Backend Setup

```bash
cd backend
bundle install

# Configure the database in config/database.yml or via DATABASE_URL
bin/rails db:create db:migrate

bin/rails server
```

The API will be available at `http://localhost:3000/`.

Key environment variables (via Rails credentials or `.env`):

```env
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
DEVISE_JWT_SECRET_KEY=your_jwt_secret
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173/` and expects the API to be reachable (configure the base URL in `src/api/api.js`).

---

## API Endpoints

| Method | Endpoint                       | Description                          | Auth Required |
|--------|----------------------------------|----------------------------------------|----------------|
| POST   | `/users`                          | Register a new user                     | No             |
| POST   | `/users/sign_in`                   | Log in and receive a JWT                 | No             |
| DELETE | `/users/sign_out`                   | Log out and revoke the JWT                | Yes            |
| GET    | `/api/v1/albums`                     | List all public albums                     | No             |
| GET    | `/api/v1/albums/my_albums`            | List the current user's albums              | Yes            |
| GET    | `/api/v1/albums/:id`                   | View a single album with its photos          | No*            |
| POST   | `/api/v1/albums`                        | Create a new album                            | Yes            |
| PATCH  | `/api/v1/albums/:id`                     | Update an album                                | Yes            |
| DELETE | `/api/v1/albums/:id`                      | Delete an album                                 | Yes            |
| POST   | `/api/v1/photos`                           | Upload a photo to an album                       | Yes            |
| DELETE | `/api/v1/photos/:id`                        | Delete a photo                                    | Yes            |

\* Private albums are only visible to their owner.

---

## Deployment

- **Backend** ships as a Docker image and is configured for zero-downtime deployment via [Kamal](https://kamal-deploy.org) (`backend/config/deploy.yml`).
- **Frontend** is configured for deployment on [Vercel](https://vercel.com) (`frontend/vercel.json`).

---

## Roadmap

- [ ] Photo tagging and search
- [ ] Album sharing via a public link
- [ ] Drag-and-drop photo upload with progress indicators
- [ ] Pagination/infinite scroll for large albums

---

## License

This project is licensed under the [MIT License](LICENSE).
