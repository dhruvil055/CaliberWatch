Google OAuth support has been removed from this project. All related code and documentation were reverted.
- Redirects to: `http://localhost:5000/api/auth/google`

### Backend Flow
1. Passport redirects to Google OAuth consent screen
2. User grants permission
3. Google redirects back to: `http://localhost:5000/api/auth/google/callback`
4. Passport handles OAuth verification and creates/updates user
5. Backend creates JWT token and redirects to: 
   `http://localhost:3001/dashboard?token=JWT_TOKEN&user=USER_DATA`

### Frontend (after callback)
- Dashboard.js detects URL parameters
- Automatically logs in user via AuthContext
- Stores token in localStorage
- Redirects to `/dashboard`

## Step 4: Test Google OAuth

1. Start backend: `npm run dev` (from `/backend`)
2. Start frontend: `npm start` (from `/frontend`)
3. Go to http://localhost:3001/login
4. Click "Continue with Google"
5. Sign in with your Google account
6. You should be redirected to dashboard

## Troubleshooting

### "Cannot GET /api/auth/google"
- Make sure backend is running on port 5000
- Check that passport middleware is configured in server.js

### "Redirect URI mismatch"
- Verify the redirect URI in Google Cloud Console matches exactly: `http://localhost:5000/api/auth/google/callback`
- Check for trailing slashes and exact spelling

### "Missing credentials"
- Ensure `.env` file has `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Restart backend after updating `.env`

### User not being created/logged in
- Check MongoDB is running: `mongodb://localhost:27017/caliber_watch`
- Check browser console for errors
- Check backend logs for detailed error messages

## Security Notes

- Never commit `.env` with real credentials to git
- In production:
  - Change `SESSION_SECRET` to a strong random string
  - Update redirect URI to your production domain
  - Use HTTPS (set `cookie.secure = true` in server.js)
  - Store secrets in environment variables on your server

## Files Modified for Google OAuth

### Backend
- `server.js` - Added session and passport middleware
- `config/passport.js` - New file with Google OAuth strategy
- `controllers/authController.js` - Added googleAuthCallback
- `routes/authRoutes.js` - Added Google OAuth routes
- `models/User.js` - Added googleId field
- `.env` - Added Google OAuth credentials

### Frontend
- `pages/Login.js` - Google button points to backend
- `pages/Register.js` - Google button points to backend
- `pages/AdminLogin.js` - Google button points to backend
- `pages/Dashboard.js` - Handles OAuth callback with query params

## Next Steps

- Implement additional OAuth providers (GitHub, Facebook, etc.)
- Add user profile picture from Google account
- Implement logout functionality
- Add OAuth linking for existing accounts
