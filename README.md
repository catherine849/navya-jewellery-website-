# NAVYA Jewellery Website

A modern, elegant e-commerce website for artificial and AD jewellery, built with Next.js and featuring a minimalist Oh Polly-inspired design.

## ✨ Features

- 🎨 **Modern UI Design** - Clean, minimalist aesthetic with Oh Polly-inspired styling
- 🛒 **Shopping Cart** - Full cart functionality with quantity controls
- ❤️ **Wishlist** - Save favorite items for later
- 💳 **Payment Integration** - Razorpay payment gateway
- 📱 **Responsive Design** - Works beautifully on all devices
- 🔐 **OTP Authentication** - Firebase phone authentication
- 📦 **Order Management** - Firebase Firestore for order storage
- 💬 **WhatsApp Notifications** - Automatic order notifications via Twilio
- 🎫 **Coupon System** - Discount code functionality

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- A Razorpay account (for payments)
- A Firebase project (for authentication and database)
- A Twilio account (for WhatsApp notifications)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/catherine849/navya-jewellery-website-.git
   cd navya-jewellery-website-
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   
   Create a \`.env.local\` file in the root directory:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Then fill in your actual credentials:
   
   \`\`\`env
   # Razorpay
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_secret_here
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
   
   # Firebase
   FIREBASE_API_KEY=AIzaSyxxxxxxxxxxxxxx
   FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project-id
   
   # Twilio
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   WHATSAPP_NUMBER=whatsapp:+919876543210
   \`\`\`

4. **Update Firebase config in code**
   
   Edit \`pages/index.js\` lines 20-24 with your Firebase config, or move them to environment variables.

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Razorpay Setup

1. Sign up at [razorpay.com](https://razorpay.com)
2. Get your API keys from the Dashboard
3. Add them to \`.env.local\`
4. For production, switch to live keys

### Firebase Setup

1. Create a project at [firebase.google.com](https://firebase.google.com)
2. Enable **Phone Authentication** in Authentication section
3. Create a **Firestore Database**
4. Add your config to \`.env.local\`

### Twilio WhatsApp Setup

1. Sign up at [twilio.com](https://twilio.com)
2. Set up WhatsApp sandbox for testing
3. For production, apply for WhatsApp Business API
4. Add credentials to \`.env.local\`

### Coupon Codes

Currently configured coupons:
- \`NAVYA10\` - 10% off
- \`GOLD20\` - 20% off

To add more, edit the \`applyCoupon\` function in \`pages/index.js\`.

## 📁 Project Structure

\`\`\`
navya-jewellery-website/
├── pages/
│   ├── api/
│   │   ├── create-order.js      # Razorpay order creation
│   │   ├── save-order.js        # Save to Firebase
│   │   └── send-whatsapp.js     # WhatsApp notifications
│   ├── _app.js                  # Next.js app wrapper
│   ├── _document.js             # HTML document with scripts
│   └── index.js                 # Main page component
├── components/
│   └── ui/
│       ├── button.js            # Button component
│       ├── card.js              # Card components
│       └── input.js             # Input component
├── styles/
│   └── globals.css              # Global styles
├── .env.example                 # Environment variables template
├── .gitignore
├── jsconfig.json
├── next.config.js
├── package.json
└── README.md
\`\`\`

## 🎨 Customization

### Changing Colors

Edit the theme object in \`pages/index.js\`:

\`\`\`javascript
const theme = {
  primary: "#1a1a1a",      // Main color
  accent: "#c9a961",        // Gold accent
  lightBg: "#fafafa",       // Light background
  border: "#e5e5e5"         // Border color
};
\`\`\`

### Adding Products

Edit the \`products\` array in \`pages/index.js\`:

\`\`\`javascript
{
  id: 7,
  name: "New Product Name",
  price: 1299,
  img: "https://your-image-url.com/image.jpg",
  category: "Necklace", // or "Earrings" or "Bridal"
  stock: true,
  new: true // Optional: shows "NEW" badge
}
\`\`\`

### Updating Contact Info

- WhatsApp button: Line 162 in \`pages/index.js\`
- Update phone number in environment variables

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

### Environment Variables on Vercel

Go to Settings → Environment Variables and add all variables from \`.env.example\`.

## 📱 Testing Payments

For testing Razorpay payments, use these test cards:
- Card Number: \`4111 1111 1111 1111\`
- CVV: Any 3 digits
- Expiry: Any future date

## 🐛 Troubleshooting

### Payment not working
- Check Razorpay keys are correct
- Ensure Razorpay script loads (check Network tab)
- Verify \`NEXT_PUBLIC_RAZORPAY_KEY_ID\` is set

### WhatsApp not sending
- Verify Twilio credentials
- Check WhatsApp sandbox is active
- Confirm recipient number is added to sandbox

### Firebase errors
- Enable Phone Authentication in Firebase
- Check Firestore rules allow writes
- Verify Firebase config is correct

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Support

For issues and questions, contact through WhatsApp or Email.
---

Built with ❤️ in Kolkata
