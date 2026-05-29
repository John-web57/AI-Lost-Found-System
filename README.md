# AI Lost & Found System (Starter)

Full-stack starter: React frontend + Node/Express backend + MongoDB.

## Run backend

```bash
cd backend
npm install
node server.js
```

Server runs on `http://localhost:5000` and serves uploaded images at `/uploads`.

## Run frontend

```bash
cd frontend
npm install
npm start
```

The React app runs on `http://localhost:3000`.

## Notes
- Images uploaded via the frontend are saved into `backend/uploads` and referenced in MongoDB.
- Each item now includes a `lost`/`found` status so the board can distinguish reported lost items from found items.
- The board also uses AI-powered text matching to suggest likely matches between lost and found reports.
- Next suggested steps: add authentication, cloud storage for images, and image-based AI matching.
