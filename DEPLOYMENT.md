# 🚀 Deployment Guide - NAVYA Jewellery Website

## Quick Deployment Checklist

- [ ] Replace old files with new redesigned files
- [ ] Set up environment variables
- [ ] Configure Firebase
- [ ] Set up Razorpay
- [ ] Configure Twilio (optional)
- [ ] Test locally
- [ ] Deploy to Vercel

---

## 📦 Step 1: Replace Files

### Files to REPLACE in your project:

1. **pages/index.js** - Main website page (completely redesigned)
2. **pages/_app.js** - App wrapper
3. **components/ui/button.js** - Updated button component
4. **components/ui/card.js** - Updated card component
5. **components/ui/input.js** - Updated input component
6. **styles/globals.css** - Global styles

### Files to ADD to your project:

1. **pages/_document.js** - NEW file (for Razorpay script)
2. **.env.example** - Environment variables template
3. **README.md** - Updated documentation

### Files that are IMPROVED (replace if you want better functionality):

1. **pages/api/create-order.js** - Better Razorpay integration
2. **pages/api/save-order.js** - Better Firebase integration
3. **pages/api/send-whatsapp.js** - Better WhatsApp formatting

---

## 🔧 Step 2: Environment Variables

### Create `.env.local` file in your project root:

\`\`\`env
# Razorpay (Required for payments)
RAZORPAY_KEY_ID=rzp_test_xxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxx

# Firebase (Required for auth & database)
FIREBASE_API_KEY=AIzaSyxxxxxxxxxxxxxx
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id

# Twilio (Optional - for WhatsApp notifications)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxx
WHATSAPP_NUMBER=whatsapp:+919876543210
\`\`\`

### Where to get these values:

**Razorpay:**
1. Go to https://dashboard.razorpay.com/
2. Navigate to Settings → API Keys
3. Generate Test Keys (or use Live keys for production)
4. Copy Key ID and Key Secret

**Firebase:**
1. Go to https://console.firebase.google.com/
2. Select your project (or create new one)
3. Go to Project Settings → General
4. Scroll to "Your apps" section
5. Copy the config values

**Twilio (Optional):**
1. Go to https://console.twilio.com/
2. Get Account SID and Auth Token from dashboard
3. For WhatsApp: Go to Messaging → Try it out → Send a WhatsApp message
4. Follow sandbox setup instructions

---

## 🔥 Step 3: Firebase Configuration

### A. Enable Phone Authentication

1. Go to Firebase Console → Authentication
2. Click "Get Started" (if first time)
3. Go to "Sign-in method" tab
4. Enable "Phone" provider
5. Save

### B. Set up Firestore Database

1. Go to Firebase Console → Firestore Database
2. Click "Create database"
3. Start in **Test mode** (for development)
4. Choose a location (close to your users)
5. Click "Enable"

### C. Update Firestore Rules (for production)

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
  }
}
\`\`\`

### D. Update Firebase Config in Code

Option 1 (Recommended): Add to `.env.local`:
\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=project-id
\`\`\`

Then update `pages/index.js` line 20-24:
\`\`\`javascript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
};
\`\`\`

Option 2: Directly in code (less secure):
\`\`\`javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id"
};
\`\`\`

---

## 💳 Step 4: Test Payments Locally

1. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Add items to cart

3. Click "Proceed to Checkout"

4. Use Razorpay test card:
   - Card: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: Any future date
   - OTP: `123456`

5. Check if:
   - Payment completes successfully
   - Order saves to Firebase
   - WhatsApp notification sends (if configured)

---

## 🌐 Step 5: Deploy to Vercel

### A. Push to GitHub

\`\`\`bash
git add .
git commit -m "Redesigned website with Oh Polly aesthetic"
git push origin main
\`\`\`

### B. Deploy on Vercel

1. Go to https://vercel.com/
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:
   - Click "Environment Variables"
   - Add ALL variables from your `.env.local`
   - Include them for Production, Preview, and Development

5. Click "Deploy"

### C. Verify Deployment

1. Visit your deployed URL
2. Test full purchase flow
3. Check Firebase for orders
4. Verify WhatsApp notifications

---

## 🎨 Step 6: Customization

### Update Brand Name

In `pages/index.js` line 38:
\`\`\`javascript
const brand = { name: "NAVYA", city: "Kolkata" };
\`\`\`

### Update WhatsApp Number

In `pages/index.js` line 162:
\`\`\`javascript
href="https://wa.me/919876543210"
\`\`\`

And in `.env.local`:
\`\`\`env
WHATSAPP_NUMBER=whatsapp:+919876543210
\`\`\`

### Add More Products

In `pages/index.js`, add to the `products` array around line 64:
\`\`\`javascript
{
  id: 7,
  name: "Your Product Name",
  price: 1999,
  img: "https://images.unsplash.com/photo-xxx",
  category: "Necklace", // or "Earrings" or "Bridal"
  stock: true,
  new: true // shows NEW badge
}
\`\`\`

### Change Colors

In `pages/index.js` line 30-35:
\`\`\`javascript
const theme = {
  primary: "#1a1a1a",      // Main black
  accent: "#c9a961",        // Gold accent
  lightBg: "#fafafa",       // Light background
  border: "#e5e5e5"         // Border color
};
\`\`\`

---

## 🐛 Common Issues & Solutions

### Issue: "Razorpay is not defined"
**Solution:** Ensure `pages/_document.js` is in place with Razorpay script

### Issue: Firebase auth not working
**Solution:** 
- Check Phone Authentication is enabled in Firebase
- Verify reCAPTCHA is loading properly
- Check browser console for errors

### Issue: Orders not saving
**Solution:**
- Check Firestore is created and rules allow writes
- Verify Firebase config is correct
- Check browser console and API logs

### Issue: WhatsApp not sending
**Solution:**
- Verify Twilio credentials in `.env.local`
- Check Twilio console for error logs
- Ensure sandbox is active (for testing)

### Issue: Vercel deployment fails
**Solution:**
- Check all environment variables are set
- Verify build logs for specific errors
- Ensure all dependencies in `package.json`

---

## ✅ Final Checklist

Before going live:

- [ ] All environment variables set in Vercel
- [ ] Razorpay LIVE keys configured (not test keys)
- [ ] Firebase Firestore rules updated for production
- [ ] WhatsApp business number configured (not sandbox)
- [ ] Tested complete purchase flow on production URL
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Contact information updated everywhere
- [ ] Legal pages added (Terms, Privacy Policy) if needed

---

## 🎉 You're Done!

Your beautiful, jewellery website is now live! 
For support or questions, refer to the main README.md or create an issue on GitHub.

Happy selling! 💎
