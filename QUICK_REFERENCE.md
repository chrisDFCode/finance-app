# 🚀 Quick Reference & File Tree

## Complete Project File Tree

```
finance-app/
│
├── 📄 Root Configuration Files
│   ├── package.json                 # Dependencies & npm scripts
│   ├── vite.config.js              # Vite build configuration
│   ├── vercel.json                 # Vercel deployment config
│   ├── .env.example                # Environment template
│   ├── .gitignore                  # Git ignore patterns
│   └── index.html                  # HTML entry point
│
├── 📚 Documentation Files (Read These!)
│   ├── README.md                   # 👈 START HERE - Quick overview
│   ├── SETUP_GUIDE.md              # 👈 MAIN GUIDE - 11 detailed sections
│   ├── IMPLEMENTATION_GUIDE.md      # Deep technical documentation
│   ├── DEPLOYMENT_CHECKLIST.md     # Pre-launch verification
│   ├── QUICK_REFERENCE.md          # This file - quick lookup
│   └── database.sql                # Database schema (SQL)
│
├── 🔧 Setup Scripts
│   ├── setup.sh                    # Linux/Mac automated setup
│   └── setup.bat                   # Windows automated setup
│
├── 📦 Source Code (src/)
│   ├── 🎨 components/              # User Interface Components
│   │   ├── AddExpenseForm.jsx       # Add expense form
│   │   ├── ExpenseTable.jsx         # Display expenses table
│   │   ├── CategoryFilter.jsx       # Filter by category
│   │   ├── MonthlySummary.jsx       # Monthly stats summary
│   │   ├── ChartComponent.jsx       # Bar & doughnut charts
│   │   └── StatsSection.jsx         # Key metrics display
│   │
│   ├── 📄 pages/                   # Page-Level Components
│   │   └── Dashboard.jsx            # Main page (orchestrates all)
│   │
│   ├── 🔌 services/                # External Services
│   │   └── supabaseClient.js        # Supabase backend integration
│   │
│   ├── 🪝 hooks/                   # Custom React Hooks
│   │   └── useExpenses.js           # Expense & filter state management
│   │
│   ├── 🛠️ utils/                   # Utility Functions
│   │   └── helpers.js               # Formatting & calculations
│   │
│   ├── 🎯 styles/                  # CSS Stylesheets
│   │   ├── global.css               # Global styles & variables
│   │   ├── dashboard.css            # Dashboard layout
│   │   └── components.css           # Component styles & responsive
│   │
│   ├── App.jsx                      # Root React component
│   ├── main.jsx                     # Application entry point
│   │
│   └── 📁 public/                  # Static Assets
│       └── (images, icons, etc)
│
└── 📦 Dependencies (installed via npm)
    ├── react@18.2.0
    ├── react-dom@18.2.0
    ├── @supabase/supabase-js@2.38.0
    ├── chart.js@4.4.0
    ├── react-chartjs-2@5.2.0
    ├── date-fns@2.30.0
    └── react-icons@4.12.0
```

## 📋 Quick Command Reference

### Setup & Installation
```bash
# Install project dependencies
npm install

# Automated setup (Windows)
setup.bat

# Automated setup (Linux/Mac)
./setup.sh
```

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment
```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy to Vercel (staging)
vercel

# Deploy to Vercel (production)
vercel --prod
```

## 🔑 Environment Setup

### Create `.env.local` File
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Get These From Supabase
1. Go to supabase.com → Your Project
2. Settings → API
3. Copy "Project URL" → paste as `VITE_SUPABASE_URL`
4. Copy "Anon Public Key" → paste as `VITE_SUPABASE_ANON_KEY`

## 📱 Component Quick Reference

### AddExpenseForm
**Handles**: Adding new expenses  
**State**: Form inputs, validation, loading  
**Props**: `onAddExpense(expense)`, `loading`  
**Emits**: Expense object with amount, category, date, note

### ExpenseTable  
**Handles**: Displaying all expenses  
**Props**: `expenses[]`, `onDelete(id)`, `loading`  
**Shows**: Date, category, amount, note, delete button

### CategoryFilter
**Handles**: Filtering expenses by category  
**Props**: `selectedCategory`, `onCategoryChange(cat)`  
**Options**: All + Food, Transport, Entertainment, Utilities, Health, Shopping, Education, Other

### MonthlySummary
**Handles**: Monthly spending overview  
**Shows**: Total amount, transaction count, category breakdown  
**Auto-calculates**: Current month totals

### ChartComponent
**Handles**: Data visualization  
**Charts**: Bar chart + Doughnut pie chart  
**Shows**: Spending by category with currency formatting

### StatsSection
**Handles**: Key metrics display  
**Shows**: Total spending, average per transaction, transaction count

### Dashboard
**Handles**: Main page orchestration  
**Does**: 
- Fetches expenses on mount
- Manages loading/error states
- Coordinates all components
- Handles add/delete operations
- Manages category filter

## 🗄️ Database Quick Reference

### Main Table: `expenses`
```sql
id              -- Auto-incrementing primary key
amount          -- Decimal (0.01 - 99,999,999.99)
category        -- Text (one of 8 categories)
date            -- ISO date format (YYYY-MM-DD)
note            -- Optional description
created_at      -- Auto timestamp
updated_at      -- Auto timestamp
```

### Available Categories
1. Food
2. Transport
3. Entertainment
4. Utilities
5. Health
6. Shopping
7. Education
8. Other

### Common Queries
```javascript
// Fetch all (ordered by date)
await expensesService.fetchAll();

// Add new
await expensesService.add({
  amount: 50,
  category: 'Food',
  date: '2024-04-15',
  note: 'Dinner'
});

// Delete by ID
await expensesService.delete(123);

// Filter by category
await expensesService.getByCategory('Food');

// Monthly summary
await expensesService.getMonthlySummary(2024, 4);
```

## 🎨 CSS Variables & Colors

### Color Palette
```css
--primary-color: #6366f1          /* Blue - main action */
--secondary-color: #ec4899        /* Pink - accents */
--success-color: #10b981          /* Green - success */
--warning-color: #f59e0b          /* Amber - warnings */
--danger-color: #ef4444           /* Red - delete */
```

### Component Colors
```javascript
getCategoryColor('Food')             → '#FF6B6B'
getCategoryColor('Transport')        → '#4ECDC4'
getCategoryColor('Entertainment')    → '#FFE66D'
getCategoryColor('Utilities')        → '#95E1D3'
getCategoryColor('Health')           → '#F38181'
getCategoryColor('Shopping')         → '#AA96DA'
getCategoryColor('Education')        → '#FCBAD3'
getCategoryColor('Other')            → '#A8DADC'
```

## 📊 Helper Functions Cheat Sheet

### Formatting
```javascript
formatCurrency(100)            → "$100.00"
formatCurrency(99.5)           → "$99.50"

formatDate('2024-04-15')       → "Apr 15, 2024"
formatDate('2024-01-01')       → "Jan 1, 2024"

getCategoryColor('Food')       → "#FF6B6B"
```

### Calculations
```javascript
// Group expenses by category
groupByCategory(expenses)
→ { Food: [...], Transport: [...] }

// Calculate totals per category
calculateCategoryTotal(expenses)
→ { Food: 150.50, Transport: 45.00 }

// Calculate grand total
calculateTotal(expenses)       → 195.50
```

## 🚀 Deployment Checklist (Quick)

- [ ] Install dependencies: `npm install`
- [ ] Create `.env.local` with Supabase keys
- [ ] Test locally: `npm run dev`
- [ ] Build: `npm run build`
- [ ] Test build: `npm run preview`
- [ ] Push to GitHub
- [ ] Connect Vercel to GitHub repo
- [ ] Add environment variables in Vercel
- [ ] Deploy and test live site

## 🔗 Important URLs

### Supabase
- Dashboard: https://app.supabase.com
- Documentation: https://supabase.com/docs
- API Reference: https://supabase.com/docs/reference/api

### Vercel
- Dashboard: https://vercel.com/dashboard
- Documentation: https://vercel.com/docs
- Deployment Guides: https://vercel.com/docs/projects/overview

### Development
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
- Chart.js Docs: https://www.chartjs.org

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Module not found | `npm install` |
| Port 5173 in use | `npm run dev -- --port 5174` |
| Env vars not loading | Check `.env.local` exists and has `VITE_` prefix |
| Charts not showing | Ensure you have expense data added |
| Build fails | Check for syntax errors in `.jsx` files |
| Vercel deployment fails | Verify env vars are set in Vercel dashboard |

## 📖 Reading Order (Recommended)

1. **README.md** (2 min) - What is this?
2. **SETUP_GUIDE.md** (15 min) - How do I set it up?
3. **IMPLEMENTATION_GUIDE.md** (20 min) - How does it work?
4. **This File** (5 min) - Quick lookup
5. **Code Files** - Dive into the source

## 📝 Common Edits

### Add a New Expense Category
Edit `AddExpenseForm.jsx` and `CategoryFilter.jsx`:
```javascript
const CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Utilities',
  'Health',
  'Shopping',
  'Education',
  'Other',
  'YOUR_NEW_CATEGORY'  // Add here
];
```

Also update `utils/helpers.js`:
```javascript
export function getCategoryColor(category) {
  const colors = {
    // ... existing
    'YOUR_NEW_CATEGORY': '#YOURCOLOR',
  };
}
```

### Change Primary Color
Edit `src/styles/global.css`:
```css
:root {
  --primary-color: #YOUR_HEX_COLOR;  /* Change here */
}
```

### Update API Connection
Edit `src/services/supabaseClient.js`:
```javascript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

---

**Use this as a quick lookup guide while developing and deploying!** 💡

Last Updated: April 2024  
Version: 1.0.0
