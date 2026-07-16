# Project Sharing Application

A full-stack app where users sign up, log in, browse other users' projects on
the home page, and submit their own project (title, developer name,
description, hosted URL) via a form that saves to MongoDB and instantly
refreshes the feed.

## Stack

- **Frontend:** React (Vite) + Tailwind CSS + React Icons + React Router
- **Backend:** Express.js + JWT auth + bcrypt password hashing
- **Database:** MongoDB (Atlas or local) via Mongoose

## Project structure

```
project-sharing-app/
├── backend/
│   ├── controllers/       # auth + project business logic
│   ├── middleware/        # JWT auth middleware
│   ├── models/            # User, Project mongoose schemas
│   ├── routes/            # /api/auth, /api/projects
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/axios.js          # axios instance, attaches JWT to requests
    │   ├── context/AuthContext.jsx
    │   ├── components/           # Navbar, ProjectCard, ProjectFeed, SubmitProject, Footer
    │   ├── pages/                # Home, Login, Signup
    │   ├── App.jsx                # routes + protected route
    │   └── main.jsx
    ├── .env.example
    └── package.json
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/project-sharing
JWT_SECRET=some_long_random_string
PORT=5000
```

For MongoDB Atlas, use your connection string instead, e.g.:
`mongodb+srv://<user>:<password>@<cluster>.mongodb.net/project-sharing`

Start the server:

```bash
npm run dev      # nodemon, auto-restarts
# or
npm start
```

The API runs at `http://localhost:5000/api`.

### API endpoints

| Method | Route              | Auth required | Description                     |
|--------|---------------------|----------------|----------------------------------|
| POST   | /api/auth/signup     | No             | Create account, returns JWT      |
| POST   | /api/auth/login       | No             | Log in, returns JWT              |
| GET    | /api/projects         | No             | List all projects (newest first) |
| POST   | /api/projects         | Yes (Bearer)   | Submit a new project             |

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env` if your backend runs somewhere other than `localhost:5000`:

```
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

Visit `http://localhost:5173`. You'll be redirected to `/login` until you
sign up or log in — after that the home page loads the project feed and
submission form.

## How the flow works

1. **Sign up / log in** — `POST /api/auth/signup` or `/api/auth/login` hashes
   or verifies the password with bcrypt and returns a JWT, which the frontend
   stores in `localStorage` and attaches to future requests.
2. **Home page** — on load, the frontend calls `GET /api/projects` and
   renders every project as a card (title, developer, description, hosted
   URL link).
3. **Submit a project** — the sidebar form calls `POST /api/projects` with
   the JWT attached. The backend saves it to MongoDB tied to the logged-in
   user. On success, the new project is prepended to the feed immediately
   and the list is re-synced with the server — no manual page refresh
   needed.

## Notes

- Passwords are hashed with bcrypt before being stored; plaintext passwords
  are never saved.
- JWTs expire after 7 days (`controllers/authController.js`); adjust
  `expiresIn` as needed.
- Card thumbnails are generated as color gradients from the project title
  since submissions only capture a title/description/URL, not an image —
  swap in real image uploads later if needed.
