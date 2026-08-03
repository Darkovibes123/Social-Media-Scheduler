# Campus Creator Scheduler
### AI-Powered Social Media Content Scheduler for Student Influencers

This is a complete, working full-stack web app matching your project proposal:
- **User Authentication** (signup/login with secure password hashing + JWT)
- **Content Dashboard** with a visual calendar grouped by date
- **AI Caption Generator** — enter a theme, get 3 caption + hashtag options
- **Scheduling Module** with Draft / Scheduled / Posted status tracking
- **Media upload** for images/videos with live preview

Stack: **React** (frontend) + **Node.js/Express** (backend) + **MongoDB** (database) + **Google Gemini API** (captions, free tier).

---

## 1. Tools to install BEFORE you start

Install these on your computer first:

1. **Node.js** (v18 or later) — includes `npm`. Download: https://nodejs.org
   - Check it worked: `node -v` and `npm -v` in a terminal.
2. **MongoDB** — pick ONE:
   - **Easiest: MongoDB Atlas** (free cloud database, no install) — https://www.mongodb.com/cloud/atlas/register
   - OR install MongoDB Community Server locally — https://www.mongodb.com/try/download/community
3. **A code editor** — VS Code recommended: https://code.visualstudio.com
4. **A Google Gemini API key** (for the AI caption generator) — https://aistudio.google.com/app/apikey
   - Free tier — no payment method required to start.
5. **Git** (optional but recommended) — https://git-scm.com

---

## 2. Project structure

```
social-scheduler/
├── backend/          <- Express API server
│   ├── config/db.js
│   ├── models/        (User.js, Post.js)
│   ├── middleware/     (auth.js, upload.js)
│   ├── controllers/    (authController.js, postController.js, aiController.js)
│   ├── routes/         (authRoutes.js, postRoutes.js, aiRoutes.js)
│   ├── uploads/        (uploaded images get stored here)
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/          <- React app
    ├── public/index.html
    ├── src/
    │   ├── api/api.js
    │   ├── context/AuthContext.js
    │   ├── pages/ (Login.js, Signup.js, Dashboard.js)
    │   ├── components/ (Calendar.js, CaptionGenerator.js, UploadForm.js, PostCard.js)
    │   ├── App.js, index.js, index.css
    ├── package.json
    └── .env.example
```

---

## 3. Step-by-step setup

### Step 1 — Get your MongoDB connection string
- **Atlas**: create a free cluster → "Connect" → "Drivers" → copy the connection string (looks like `mongodb+srv://user:pass@cluster.mongodb.net/social_scheduler`).
- **Local**: your string is simply `mongodb://127.0.0.1:27017/social_scheduler` (just make sure the MongoDB service is running).

### Step 2 — Configure the backend
```bash
cd social-scheduler/backend
npm install
cp .env.example .env
```
Open `.env` and fill in:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string_you_make_up
PORT=5000
GEMINI_API_KEY=your_gemini_key
```

### Step 3 — Run the backend
```bash
npm run dev
```
You should see `MongoDB connected successfully` and `Server running on http://localhost:5000`.
Test it by visiting http://localhost:5000/api/health in your browser — you should see `{"status":"Server is running"}`.

### Step 4 — Configure the frontend
Open a **new terminal window** (keep the backend running in the first one):
```bash
cd social-scheduler/frontend
npm install
cp .env.example .env
```
The default `.env` value (`http://localhost:5000/api`) is already correct if you didn't change the backend port.

### Step 5 — Run the frontend
```bash
npm start
```
This opens the app automatically at http://localhost:3000.

### Step 6 — Use the app
1. Go to the Signup page, create an account.
2. On the Dashboard, type a theme like `pageant evening gown look` into the AI Caption Generator and click **Generate Captions**.
3. Click **Use this one** on your favorite option — it auto-fills the post form below.
4. Upload an image (optional), pick a date/time, choose a status, and click **Save Post**.
5. Your post appears in the Content Calendar, grouped by date. You can change its status or delete it any time.

---

## 4. Deploying it later (optional, for your final demo)
- **Backend**: Render.com or Railway.app (free tiers work well for Node/Express + MongoDB Atlas).
- **Frontend**: Vercel or Netlify (free, connects directly to a GitHub repo).
- Remember to update `REACT_APP_API_URL` in the frontend `.env` to point to your deployed backend URL.

---

## 5. What's already built vs. what you can extend
**Already working:** auth, image upload, AI captions (3 options with hashtags), scheduling queue with statuses, calendar view grouped by date, full CRUD on posts.

**Good next steps if you want to expand the mini-project into a bigger one:**
- Auto-posting to Instagram/TikTok via their official APIs (requires business developer accounts — out of scope for a lightweight student project, which is why this app manages the queue instead).
- Drag-and-drop calendar rescheduling.
- Analytics dashboard (best posting times, engagement estimates).

---

## 6. Troubleshooting
- **"MongoDB connection failed"** → double-check `MONGO_URI` and that your Atlas cluster allows your IP address (Atlas → Network Access → Add IP Address → "Allow from anywhere" for testing).
- **AI generator returns an error** → check your `GEMINI_API_KEY` is correct and pasted without extra spaces.
- **CORS or "Network Error" in the browser** → make sure the backend is running on port 5000 and `REACT_APP_API_URL` in the frontend `.env` matches it.
- **Uploaded images don't show** → make sure the backend's `uploads` folder exists (it's included) and the backend is running when you view the dashboard.
