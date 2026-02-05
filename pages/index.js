import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  MessageCircle,
  User,
  Heart,
  BarChart3,
  FileText,
  Search
} from "lucide-react";

/* Firebase OTP Login */
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* Theme */
const theme = {
  primary: "#5A2A55",
  gold: "#D4AF37",
  blush: "#FFF6F9",
  text: "#2B2B2B"
};

export default function JewelleryWebsite() {
  const brand = { name: "Navya Jewellery", city: "Kolkata" };

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [adminView, setAdminView] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [accountOpen, setAccountOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  
  /* Login */
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [user, setUser] = useState(null);

  /* Reviews */
  const [reviews, setReviews] = useState({});
  const [newReview, setNewReview] = useState("");

  /* Coupons */
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const products = [
  {
    id: 1,
    name: "Elegant AD Necklace Set",
    price: 1499,
    img: "https://images.unsplash.com/photo-1617038260897-41a1f14a2f59?q=80&w=800&auto=format&fit=crop",
    category: "Necklace",
    stock: true,
    new: true
  },
  {
    id: 2,
    name: "Traditional Kundan Earrings",
    price: 499,
    img: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop",
    category: "Earrings",
    stock: true
  },
  {
    id: 3,
    name: "Bridal Choker Set",
    price: 1999,
    img: "https://images.unsplash.com/photo-1627295116034-7c6c1c3c3b02?q=80&w=800&auto=format&fit=crop",
    category: "Bridal",
    stock: false
  }
];

  const filteredProducts = products.filter(p =>
    (category === "All" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const subtotal = cart.reduce((s, i) => s + i.price, 0);
  const finalTotal = subtotal - subtotal * discount;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const addToCart = (p) => { setCart([...cart, p]); setCartOpen(true); };
  const addToWishlist = (p) => { if (!wishlist.find(w => w.id === p.id)) setWishlist([...wishlist, p]); };

  /* OTP */
  const sendOTP = async () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: "invisible" });
    const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
    setConfirmation(result);
  };
  const verifyOTP = async () => {
    const result = await confirmation.confirm(otp);
    setUser(result.user);
  };

  /* Reviews */
  const addReview = (productId) => {
    setReviews({ ...reviews, [productId]: [...(reviews[productId] || []), newReview] });
    setNewReview("");
  };

  /* Coupons */
  const applyCoupon = () => {
    if (coupon === "NAVYA10") setDiscount(0.10);
    else if (coupon === "GOLD20") setDiscount(0.20);
    else alert("Invalid coupon");
  };

  /* Payment */
  const handlePayment = async () => {
    const res = await fetch("/api/create-order", { method: "POST" });
    const data = await res.json();
    const options = {
      key: "YOUR_RAZORPAY_KEY",
      amount: data.amount,
      currency: "INR",
      name: brand.name,
      order_id: data.id,
      handler: function () { completeOrder(); },
      theme: { color: theme.primary }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const completeOrder = async () => {
    const orderData = { items: cart, total: finalTotal };
    await fetch("/api/save-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(orderData) });
    await fetch("/api/send-whatsapp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(orderData) });
    setOrders([...orders, orderData]);
    setCart([]);
    setCartOpen(false);
  };

return (
  <div style={{
  backgroundColor: "#ffffff",
  minHeight: "100vh",
  fontFamily: "'Playfair Display', serif",
  color: "#1f1f1f"
}}>
      <a
  href="https://wa.me/919876543210"
  target="_blank"
  rel="noopener noreferrer"
  style={{
    position: "fixed",
    bottom: "20px",
    left: "20px",
    width: "56px",
    height: "56px",
    backgroundColor: "#25D366",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    zIndex: 9999
  }}
>
  <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 32 32"
  width="28"
  height="28"
  fill="white"
>
  <path d="M19.11 17.39c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.29-.74.94-.91 1.13-.17.19-.34.21-.63.07-.29-.14-1.23-.45-2.34-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.12-.59.13-.13.29-.34.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.87-2.11-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 1-.96 2.43.04 1.43 1.04 2.8 1.19 3 .14.19 2.04 3.11 4.95 4.36.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.7-.7 1.94-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.33z"/>
  <path d="M16.04 2.003C8.85 2.003 3.003 7.85 3.003 15.04c0 2.41.63 4.75 1.83 6.8L3 30l8.35-2.19c1.98 1.08 4.22 1.65 6.69 1.65h.01c7.19 0 13.04-5.85 13.04-13.04 0-3.48-1.36-6.75-3.83-9.21-2.46-2.46-5.73-3.82-9.21-3.82zm0 23.92h-.01c-2.16 0-4.28-.58-6.13-1.67l-.44-.26-4.95 1.3 1.32-4.82-.28-.5a10.92 10.92 0 01-1.69-5.79c0-6.04 4.92-10.96 10.97-10.96 2.93 0 5.68 1.14 7.76 3.22a10.9 10.9 0 013.22 7.75c0 6.04-4.92 10.96-10.96 10.96z"/>
</svg>
</a>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

    {/* Logo */}
    <h1 style={{ color: theme.primary }} className="text-2xl font-semibold tracking-wide">
      {brand.name}
    </h1>

    {/* Categories */}
    <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
      {["All", "Necklace", "Earrings", "Bridal"].map(cat => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={`hover:text-black ${category === cat ? "text-black font-semibold" : ""}`}
        >
          {cat}
        </button>
      ))}
    </nav>

    {/* Right Icons */}
    <div className="flex items-center gap-4">
      <div className="hidden md:block w-56">
        <Input
          placeholder="Search jewellery..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <button onClick={() => setAccountOpen(true)} className="p-2 rounded-full hover:bg-gray-100">
  <User size={20} />
</button>

<button onClick={() => setWishlistOpen(true)} className="p-2 rounded-full hover:bg-gray-100">
  <Heart size={20} />
</button>

<button onClick={() => setCartOpen(true)} className="p-2 rounded-full hover:bg-gray-100">
  <ShoppingCart size={20} />
</button>
    </div>
  </div>
</header>

      <section className="text-center py-20 bg-[#fafafa]">
  <h2 className="text-4xl font-semibold mb-3" style={{ color: theme.primary }}>
    Luxury Jewellery, Everyday Elegance
  </h2>
  <p className="text-gray-600">Artificial & AD Jewellery crafted in {brand.city}</p>
</section>

      <div className="max-w-5xl mx-auto px-6 flex gap-4 mb-8">
        <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded">
          <option>All</option><option>Necklace</option><option>Earrings</option><option>Bridal</option>
        </select>
      </div>

      <section className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-6 pb-24 max-w-7xl mx-auto">
  {filteredProducts.map(p => (
    <div key={p.id} className="group">

      {/* Image */}
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={p.img}
          alt={p.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      {/* Info */}
      <div className="mt-4 text-center">
        <h3 className="text-sm font-medium text-gray-800">{p.name}</h3>
        <p className="mt-1 font-semibold" style={{ color: theme.primary }}>₹{p.price}</p>
      </div>

      {/* Buttons */}
      <div className="mt-3 flex gap-2 justify-center">
        <Button
          onClick={() => addToCart(p)}
          className="px-4"
          style={{ background: theme.primary, color: "white" }}
        >
          Add to Cart
        </Button>
        <Button variant="outline" onClick={() => addToWishlist(p)}>
          <Heart size={16} />
        </Button>
      </div>
    </div>
  ))}
</section>
{/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="fixed top-0 right-0 h-full w-96 p-6 z-50"
            style={{ background: "#111" }}
          >
            <h2 className="text-xl mb-4">Your Cart</h2>

            {cart.length === 0 && <p>Cart is empty</p>}

            {cart.map((item, i) => (
              <div key={i} className="flex justify-between mb-2">
                <span>{item.name}</span>
                <span>₹{item.price}</span>
              </div>
            ))}

            <Input placeholder="Coupon" value={coupon} onChange={e => setCoupon(e.target.value)} />
            <Button onClick={applyCoupon} className="mt-2">Apply</Button>

            <div className="mt-4 font-bold">Total ₹{finalTotal}</div>

            <Button className="w-full mt-4" style={{ background: theme.gold, color: "#000" }}>
              Pay Securely
            </Button>

            <Button variant="outline" className="w-full mt-2" onClick={() => setCartOpen(false)}>
              Close
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
<AnimatePresence>
  {accountOpen && (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      className="fixed top-0 right-0 h-full w-80 p-6 z-50 bg-white shadow-2xl flex flex-col"
    >
      <h2 className="text-xl font-semibold mb-4">My Account</h2>

      {!user ? (
        <>
          <Input placeholder="+91 Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Button onClick={sendOTP} className="mt-2">Send OTP</Button>
          <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <Button onClick={verifyOTP} className="mt-2">Login</Button>
          <div id="recaptcha-container"></div>
        </>
      ) : (
        <p className="text-green-600 font-medium">Welcome! You are logged in.</p>
      )}

      <Button variant="outline" className="mt-auto" onClick={() => setAccountOpen(false)}>
        Close
      </Button>
    </motion.div>
  )}
</AnimatePresence>
    {/* Account Panel */}
<AnimatePresence>
  {accountOpen && (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      className="fixed top-0 right-0 h-full w-80 p-6 z-50 bg-white shadow-2xl flex flex-col"
    >
      <h2 className="text-xl font-semibold mb-4">My Account</h2>

      {!user ? (
        <>
          <Input
            placeholder="+91 Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button onClick={sendOTP} className="mt-2">Send OTP</Button>

          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button onClick={verifyOTP} className="mt-2">Login</Button>

          <div id="recaptcha-container"></div>
        </>
      ) : (
        <p className="text-green-600 font-medium">
          Welcome! You are logged in 💖
        </p>
      )}

      <Button
        variant="outline"
        className="mt-auto"
        onClick={() => setAccountOpen(false)}
      >
        Close
      </Button>
    </motion.div>
  )}
</AnimatePresence>
    <AnimatePresence>
  {accountOpen && (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      className="fixed top-0 right-0 h-full w-80 p-6 z-[9999] bg-white shadow-2xl flex flex-col"
    >
      <h2 className="text-xl font-semibold mb-4">My Account</h2>

      {!user ? (
        <>
          <Input placeholder="+91 Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Button onClick={sendOTP} className="mt-2">Send OTP</Button>

          <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <Button onClick={verifyOTP} className="mt-2">Login</Button>

          <div id="recaptcha-container"></div>
        </>
      ) : (
        <p className="text-green-600 font-medium">Welcome! You are logged in 💖</p>
      )}

      <Button variant="outline" className="mt-auto" onClick={() => setAccountOpen(false)}>
        Close
      </Button>
    </motion.div>
  )}
</AnimatePresence>
    <AnimatePresence>
  {wishlistOpen && (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      className="fixed top-0 right-0 h-full w-80 p-6 z-[9999] bg-white shadow-2xl flex flex-col"
    >
      <h2 className="text-xl font-semibold mb-4">Your Wishlist</h2>

      {wishlist.length === 0 && <p>No items yet</p>}

      {wishlist.map((item, i) => (
        <div key={i} className="flex justify-between mb-3">
          <span>{item.name}</span>
          <Button size="sm" onClick={() => addToCart(item)}>Add</Button>
        </div>
      ))}

      <Button variant="outline" className="mt-auto" onClick={() => setWishlistOpen(false)}>
        Close
      </Button>
    </motion.div>
  )}
</AnimatePresence>
      <footer className="text-center mt-20 text-gray-500">
        © {new Date().getFullYear()} {brand.name} · {brand.city}
      </footer>

    </div>
  );
}
