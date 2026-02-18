# Payment Checkout Troubleshooting Guide

## Common 404 Errors

### Error: "Failed to load resource: the server responded with a status of 404"

This usually means the frontend can't find the backend API endpoint. Check these:

#### 1. Verify Backend is Running

**Check if backend server is running:**
- Open: http://localhost:3000/health
- Should see: `{"status":"ok"}`

**If not running:**
```bash
cd backend
node server.js
```

#### 2. Verify Frontend `.env.local` Configuration

**Check `.env.local` in root directory:**
```env
VITE_API_URL=http://localhost:3000/api
```

**Important:**
- File must be in root: `WebPage/.env.local` (NOT in `backend/`)
- Must restart frontend dev server after changing `.env.local`
- No spaces around the `=` sign

#### 3. Verify Backend Route Matches

**Backend route (in `backend/server.js`):**
```javascript
app.post('/api/payment/checkout', async (req, res) => {
```

**Frontend call (in `src/lib/api/payment.ts`):**
```javascript
apiClient.post('/payment/checkout', data)
```

**How it works:**
- Frontend baseURL: `http://localhost:3000/api` (from `VITE_API_URL`)
- Frontend endpoint: `/payment/checkout`
- Final URL: `http://localhost:3000/api/payment/checkout` ✅

#### 4. Check Browser Console

**Open browser DevTools (F12) → Network tab:**
- Look for the failed request
- Check the **Request URL** - should be `http://localhost:3000/api/payment/checkout`
- If it's different, the `VITE_API_URL` is wrong

#### 5. Check CORS Settings

**Backend CORS (in `backend/server.js`):**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
```

**Make sure:**
- `FRONTEND_URL` in `backend/.env` matches your frontend URL
- Default is `http://localhost:8080` (Vite default)

## Debugging Steps

### Step 1: Test Backend Directly

**Test health endpoint:**
```bash
# PowerShell
Invoke-WebRequest -Uri http://localhost:3000/health

# Should return: {"status":"ok"}
```

**Test checkout endpoint:**
```powershell
$body = @{
    priceId = "price_test123"
    successUrl = "http://localhost:8080/success"
    cancelUrl = "http://localhost:8080/cancel"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3000/api/payment/checkout `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### Step 2: Check Frontend Environment

**In browser console, check:**
```javascript
// Should show: "http://localhost:3000/api"
console.log(import.meta.env.VITE_API_URL);
```

**If undefined:**
- `.env.local` file doesn't exist or is in wrong location
- Frontend server wasn't restarted after creating `.env.local`

### Step 3: Verify URL Construction

**Add temporary logging in `src/lib/api/payment.ts`:**
```javascript
async createCheckoutSession(data) {
  console.log('API Base URL:', import.meta.env.VITE_API_URL);
  console.log('Calling endpoint: /payment/checkout');
  console.log('Full URL will be:', `${import.meta.env.VITE_API_URL}/payment/checkout`);
  // ... rest of code
}
```

## Common Issues

### Issue: "Network Error" or "Failed to fetch"

**Cause:** Backend server not running or wrong URL

**Fix:**
1. Start backend: `cd backend && node server.js`
2. Verify `VITE_API_URL=http://localhost:3000/api` in `.env.local`
3. Restart frontend dev server

### Issue: "CORS error"

**Cause:** Backend CORS not allowing frontend origin

**Fix:**
1. Check `FRONTEND_URL` in `backend/.env`
2. Should match your frontend URL (usually `http://localhost:8080`)
3. Restart backend server

### Issue: "404 on /api/payment/checkout"

**Cause:** Route path mismatch

**Fix:**
1. Backend route must be: `app.post('/api/payment/checkout', ...)`
2. Frontend calls: `apiClient.post('/payment/checkout', ...)`
3. API client baseURL: `http://localhost:3000/api`
4. Final URL: `http://localhost:3000/api/payment/checkout` ✅

### Issue: "404 on /payment/checkout" (without /api)

**Cause:** `VITE_API_URL` not set, using default `/api` relative URL

**Fix:**
1. Create `.env.local` in root directory
2. Add: `VITE_API_URL=http://localhost:3000/api`
3. Restart frontend dev server

## Still Not Working?

1. **Check backend console** - Are requests reaching the server?
2. **Check browser Network tab** - What exact URL is being called?
3. **Check backend logs** - Any errors in `backend/server.js` console?
4. **Verify ports** - Backend on 3000, Frontend on 8080?

## Quick Checklist

- [ ] Backend server running on port 3000
- [ ] `.env.local` exists in root directory
- [ ] `VITE_API_URL=http://localhost:3000/api` in `.env.local`
- [ ] Frontend dev server restarted after creating `.env.local`
- [ ] Backend route is `/api/payment/checkout`
- [ ] Frontend calls `/payment/checkout` (not `/api/payment/checkout`)
- [ ] CORS allows `http://localhost:8080`
- [ ] Stripe keys are set in both `.env.local` and `backend/.env`
