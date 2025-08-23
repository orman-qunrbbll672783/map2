# Google Maps & Geolocation Troubleshooting Guide

## Issues Fixed

### 1. ✅ Google Maps Domain Restriction Error
**Problem**: `RefererNotAllowedMapError` - Your API key domain restrictions don't allow the current domain.

**Solution**: 
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your Google Maps API key: `AIzaSyB-8A1I1aVPFYdJHkf-pLvm5oESl_tYFN4`
4. Under **Application restrictions**:
   - **Option A (Recommended for development)**: Select "None" 
   - **Option B (More secure)**: Add these domains:
     - `http://localhost:3000`
     - `http://localhost:3001`
     - `http://127.0.0.1:3000`
     - `http://127.0.0.1:3001`
     - Your production domain when you deploy
5. Click **Save** and wait 2-5 minutes for changes to take effect

### 2. ✅ Improved Geolocation Handling
**Problem**: Geolocation was failing and causing errors.

**Fixed with**:
- Multiple fallback methods (high accuracy → low accuracy → IP-based location)
- Better error handling and user feedback
- Automatic fallback to New York City if all methods fail
- IP-based location detection using ipapi.co as final fallback

### 3. ✅ Better Error Messages & User Experience
**Added**:
- Visual error notifications in the UI
- Detailed console logging for debugging
- Helpful troubleshooting steps
- Map overlay when Google Maps fails to load
- Quick-fix instructions in the welcome card

## Current Configuration

### Environment Variables (✅ Configured)
```env
REACT_APP_SUPABASE_URL=https://hifxufhisckjxdedwjlm.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyB-8A1I1aVPFYdJHkf-pLvm5oESl_tYFN4
```

### Required Google Cloud APIs (✅ Should be enabled)
- Maps JavaScript API
- Places API
- (Optional) Geolocation API

## Quick Fix Steps

### If you're still seeing the RefererNotAllowed error:

1. **Immediate Fix** (Less secure, good for development):
   ```
   Google Cloud Console → Your API Key → Application restrictions → None → Save
   ```

2. **Secure Fix** (Recommended for production):
   ```
   Google Cloud Console → Your API Key → Application restrictions → HTTP referrers (web sites)
   Add: http://localhost:3000/*, http://localhost:3001/*, https://yourdomain.com/*
   ```

3. **Wait 2-5 minutes** for Google's systems to update

4. **Refresh your browser** and try again

### If geolocation is still not working:

1. Make sure you're using **HTTPS** or **localhost** (required for geolocation)
2. Check browser permissions (click the location icon in the address bar)
3. Try a different browser
4. The app will automatically fall back to New York City if geolocation fails

## Testing the Fixes

After making the Google Cloud Console changes:

1. **Restart your development server**:
   ```bash
   npm start
   ```

2. **Open browser developer tools** (F12) and check the Console tab

3. **Look for these success messages**:
   - ✅ Google Maps script loaded successfully!
   - ✅ Location detected: {coordinates}
   - ✅ Google Map created successfully

4. **Test geolocation**:
   - Allow location when prompted
   - If denied, app should fall back to default location
   - Click on map to change search location

5. **Test business search**:
   - Select business types
   - Click "Search Businesses"
   - Markers should appear on map

## Additional Notes

- **API Usage**: Each search uses your Google Maps API quota
- **Billing**: Make sure billing is enabled in Google Cloud Console
- **Security**: Consider adding domain restrictions for production deployment
- **Rate Limits**: Google Maps has daily/monthly usage limits

## Support

If you're still having issues:
1. Check the browser console for detailed error messages
2. Verify your Google Cloud Console settings
3. Make sure all required APIs are enabled
4. Check that billing is enabled for your Google Cloud project

The app now provides detailed troubleshooting information in the console and UI to help you resolve any remaining issues.