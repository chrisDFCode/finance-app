# Personal Finance Web App - Setup & Deployment Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Local Setup](#local-setup)
4. [Supabase Setup](#supabase-setup)
5. [Environment Variables](#environment-variables)
6. [Running the Application](#running-the-application)
7. [Building for Production](#building-for-production)
8. [Deploying to Vercel](#deploying-to-vercel)
9. [Database Schema](#database-schema)
10. [Features](#features)
11. [Troubleshooting](#troubleshooting)

---

## Project Overview

A modern personal finance expense tracker built with:
- **Frontend**: React 18 with Vite (fast build tool)
- **Backend**: Supabase (PostgreSQL database)
- **Charts**: Chart.js for data visualization
- **Styling**: Custom CSS (no frameworks needed)

The app allows users to:
- ✅ Add, view, and delete expenses
- ✅ Categorize expenses
- ✅ Filter by category
- ✅ View monthly summaries
- ✅ Visualize spending with charts
- ✅ See real-time statistics

---

## Prerequisites

Before starting, ensure you have:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** (optional, for version control)
- **Supabase Account** - [Create Free Account](https://supabase.com)
- **Vercel Account** (for deployment) - [Create Free Account](https://vercel.com)

Check your Node.js and npm versions:
```bash
node --version
npm --version
```

---

## Local Setup

### Step 1: Clone or Download the Project

If you have the project files, navigate to the project directory:
```bash
cd finance-app
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages:
- React & React DOM
- Supabase client library
- Chart.js & react-chartjs-2
- Vite and dev dependencies

Expected packages:
```
react@^18.2.0
react-dom@^18.2.0
@supabase/supabase-js@^2.38.0
chart.js@^4.4.0
react-chartjs-2@^5.2.0
date-fns@^2.30.0
react-icons@^4.12.0
```

### Step 3: Verify Project Structure

Your project should look like this:
```
finance-app/
├── src/
│   ├── components/          # React components
│   │   ├── AddExpenseForm.jsx
│   │   ├── ExpenseTable.jsx
│   │   ├── CategoryFilter.jsx
│   │   ├── MonthlySummary.jsx
│   │   ├── ChartComponent.jsx
│   │   └── StatsSection.jsx
│   ├── pages/               # Page components
│   │   └── Dashboard.jsx
│   ├── services/            # Supabase client
│   │   └── supabaseClient.js
│   ├── hooks/               # Custom React hooks
│   │   └── useExpenses.js
│   ├── utils/               # Utility functions
│   │   └── helpers.js
│   ├── styles/              # CSS files
│   │   ├── global.css
│   │   ├── dashboard.css
│   │   └── components.css
│   ├── App.jsx
│   └── main.jsx
├── public/                  # Static files
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
└── database.sql             # Supabase schema
```

---

## Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign up/login
2. Click **"New project"** in the dashboard
3. Fill in the project details:
   - **Project name**: `finance-app` (or your preferred name)
   - **Database password**: Create a strong password (save it!)
   - **Region**: Select the closest region to you
4. Click **"Create new project"** (this takes 1-2 minutes)

### Step 2: Set Up the Database Schema

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the entire contents of `database.sql` file from your project
4. Paste it into the SQL editor
5. Click **"Run"** button to execute the schema
6. You should see: "Success ✓" message

**What the schema creates:**
- `expenses` table with columns: id, amount, category, date, note, created_at, updated_at
- Indexes for fast queries by date, category
- Automatic timestamp updates

### Step 3: Get Your API Keys

1. Go to **Settings** → **API** in Supabase
2. You'll see:
   - **Project URL** (copy this)
   - **Anon Public Key** (copy this)
3. Keep these safe - you'll need them for environment variables

---

## Environment Variables

### Step 1: Create `.env` File

In your project root directory, create a file named `.env.local`:

```bash
# For development
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Step 2: Get Your Credentials

From Supabase dashboard:
1. Go to **Settings** → **API**
2. Copy **Project URL** → paste as `VITE_SUPABASE_URL`
3. Copy **Anon Public Key** → paste as `VITE_SUPABASE_ANON_KEY`

Example (with fake values):
```bash
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Security Note

⚠️ **IMPORTANT**: 
- The Anon key is safe to expose (it's published on frontend)
- Never commit `.env.local` to git (it's in `.gitignore`)
- For production, use Vercel environment variables (see Vercel setup)

---

## Running the Application

### Development Server

Start the Vite development server:
```bash
npm run dev
```

The app should automatically open at `http://localhost:5173`

If it doesn't:
1. Check your terminal for the URL (usually shown)
2. Manually open `http://localhost:5173` in your browser

### What to See
- Header with "💰 Finance Tracker"
- Form to add expenses (left side)
- Category filter buttons
- Stats section showing totals
- Monthly summary
- Charts (bar chart & doughnut chart)
- Expenses table

### Stopping the Server
Press `Ctrl + C` in your terminal

---

## Building for Production

### Create Production Build

```bash
npm run build
```

This creates an optimized `dist/` folder with:
- Minified JavaScript
- Optimized CSS
- Compressed assets

### Preview Production Build Locally

```bash
npm run preview
```

Opens the production build at `http://localhost:4173`

---

## Deploying to Vercel

### Option 1: Deploy via GitHub (Recommended)

#### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/finance-app.git
git push -u origin main
```

#### 2. Connect Vercel to GitHub
1. Go to [Vercel](https://vercel.com)
2. Sign up/login with GitHub account
3. Click **Import Project**
4. Select your GitHub repository
5. Click **Import**

#### 3. Set Environment Variables
On the Vercel import screen:
1. Go to **Environment Variables** section
2. Add the following:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: Your Supabase URL
3. Add another:
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase Anon Key
4. Click **Deploy**

Vercel will automatically:
- Build your project
- Deploy to production
- Give you a live URL

### Option 2: Direct Deployment via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production
vercel --prod
```

Then set environment variables in Vercel dashboard.

### Option 3: Use Vercel Web Dashboard

1. Go to `vercel.com`
2. Upload your project folder via drag-and-drop
3. Add environment variables
4. Deploy

---

## Database Schema

### Expenses Table

```sql
expenses
├── id (BIGINT, Primary Key)
├── amount (DECIMAL, Required)
├── category (VARCHAR, Required)
├── date (DATE, Required)
├── note (TEXT, Optional)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### Available Categories
- Food
- Transport
- Entertainment
- Utilities
- Health
- Shopping
- Education
- Other

### Sample Query
```sql
-- Get all expenses for April 2024
SELECT * FROM expenses 
WHERE date >= '2024-04-01' AND date < '2024-05-01'
ORDER BY date DESC;
```

---

## Features

### ✅ Core Features Implemented

1. **Add Expense**
   - Amount, category, date, note fields
   - Validation
   - Real-time updates

2. **View Expenses**
   - Table display
   - Date formatted nicely
   - Currency formatted

3. **Delete Expense**
   - Confirmation dialog
   - Instant removal

4. **Dynamic Total Spending**
   - Updates automatically
   - Shows total transactions
   - Calculates average

5. **Category Filter**
   - Filter by any category
   - "All" shows all expenses
   - Updates charts & table

6. **Monthly Summary**
   - Current month focus
   - Total spending per month
   - Breakdown by category

7. **Charts**
   - Bar chart by category
   - Doughnut pie chart
   - Responsive design

8. **Responsive Design**
   - Mobile-friendly
   - Tablet optimized
   - Desktop view optimized

---

## Troubleshooting

### Common Issues & Solutions

#### "Cannot find environment variables"
**Problem**: App shows error about missing SUPABASE_URL
**Solution**:
- Ensure `.env.local` file exists in root directory
- Check variable names: `VITE_SUPABASE_URL` (not `VITE_SUPABASE_URL_HERE`)
- Restart dev server: `npm run dev`

#### "CORS Error when fetching data"
**Problem**: Browser shows CORS error when trying to load expenses
**Solution**:
- Check Supabase project settings
- Go to Settings → API → CORS Configuration
- Add your domain (localhost:5173 for dev, yoursite.com for prod)

#### "Expenses not saving to database"
**Problem**: Can add expense but it disappears on refresh
**Solution**:
- Check Supabase table exists: Go to Supabase → Tables
- Verify `expenses` table is created
- Run the database.sql schema again
- Check API keys are correct

#### "Port 5173 already in use"
**Problem**: Error says port 5173 is already in use
**Solution**:
```bash
# Kill process on that port, then:
npm run dev -- --port 5174
```

#### "npm install fails"
**Problem**: Installation errors
**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### "Build fails on Vercel"
**Problem**: Deployment fails with build error
**Solution**:
1. Check environment variables are set in Vercel
2. Ensure Node version is 16+ (check `nodeVersion` in `vercel.json`)
3. Check for any import errors in code
4. Review Vercel build logs for specific error

#### "Charts not displaying"
**Problem**: Chart.js charts appear blank
**Solution**:
- Ensure Chart.js is installed: `npm install chart.js react-chartjs-2`
- Check browser console for errors
- Verify you have expense data (charts don't show with 0 expenses)

---

## Performance Tips

1. **Database Indexes**: Already included in schema for fast queries
2. **Lazy Loading**: Charts load only when needed
3. **Production Build**: Always use `npm run build` before deploying
4. **Monitor**: Use Supabase dashboard to monitor database usage

---

## Next Steps

Want to enhance the app? Here are ideas:

1. **User Authentication**: Add login/signup with Supabase Auth
2. **Budget Limits**: Set monthly budget per category
3. **Recurring Expenses**: Add recurring expense templates
4. **Export Data**: Export expenses as CSV/PDF
5. **Dark Mode**: Add theme toggle
6. **Mobile App**: Convert to React Native
7. **Multi-currency**: Support different currencies
8. **Budgeting Goals**: Set and track savings goals

---

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Vercel Docs**: https://vercel.com/docs
- **Chart.js Docs**: https://www.chartjs.org/docs

---

## License

This project is free to use and modify. Feel free to customize it for your needs!

---

**Happy expense tracking! 💰**
