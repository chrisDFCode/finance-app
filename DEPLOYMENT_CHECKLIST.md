# Deployment Checklist

## Pre-Deployment

- [ ] All dependencies installed (`npm install`)
- [ ] Development version tested locally (`npm run dev`)
- [ ] No console errors in browser
- [ ] Supabase URL and keys are correct in `.env.local`
- [ ] Database schema applied successfully (`database.sql`)
- [ ] All features working:
  - [ ] Adding expenses
  - [ ] Viewing expenses
  - [ ] Deleting expenses
  - [ ] Filtering by category
  - [ ] Charts displaying
  - [ ] Monthly summary showing

## Build & Testing

- [ ] Production build created successfully (`npm run build`)
- [ ] Build output in `dist/` folder
- [ ] Production build previewed (`npm run preview`)
- [ ] No build errors or warnings
- [ ] All features work in production build

## Vercel Deployment

- [ ] Project pushed to GitHub
- [ ] Vercel project created
- [ ] Repository connected to Vercel
- [ ] Environment variables added in Vercel:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `vercel.json` config file exists
- [ ] Deployment triggered and successful
- [ ] Live URL working

## Post-Deployment

- [ ] Live site tested in multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Mobile/responsive design verified
- [ ] Add/view/delete expenses working on live site
- [ ] Charts displaying on live site
- [ ] Performance acceptable (Lighthouse score 80+)
- [ ] No console errors in production
- [ ] Database connection stable

## Security Verification

- [ ] No API keys exposed in code
- [ ] `.env.local` in `.gitignore`
- [ ] Environment variables only in Vercel settings
- [ ] CORS configured in Supabase (if needed)
- [ ] Database RLS policies enabled (optional)

## Monitoring

- [ ] Set up monitoring alerts in Supabase
- [ ] Monitor error logs
- [ ] Track performance metrics
- [ ] Monitor API usage

## Optional Enhancements

- [ ] Set up custom domain
- [ ] Enable SSL/HTTPS (automatic with Vercel)
- [ ] Set up email notifications
- [ ] Add analytics
- [ ] Configure CDN (automatic with Vercel)

---

**Deployment Date**: _______________

**Deployed By**: _______________

**Live URL**: _______________

**Notes**: 
