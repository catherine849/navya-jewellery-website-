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
    backgroundColor: "#0f0f14",
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "'Playfair Display', serif",
    color: "white"
  }}>

      <a
  href="https://wa.me/919876543210"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-6 right-6 w-14 h-14 flex items-center justify-center rounded-full shadow-2xl z-50 hover:scale-110 transition"
  style={{ backgroundColor: "#25D366", color: "white" }}
>
  <MessageCircle size={28} />
</a>
      <header
  className="px-6 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
  style={{ background: theme.primary, color: "white" }}
>
  <div>
    <h1 className="text-4xl font-bold tracking-widest" style={{ color: theme.gold }}>
      {brand.name}
    </h1>
    <p className="text-sm text-gray-300">
      Artificial & AD Jewellery • {brand.city}
    </p>
  </div>
        {!user ? (
          <div className="flex gap-2">
            <Input placeholder="+91 Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Button onClick={sendOTP}>OTP</Button>
            <Input placeholder="Code" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <Button onClick={verifyOTP}>Login</Button>
            <div id="recaptcha-container"></div>
          </div>
        ) : <span>Welcome 💖</span>}

        <div className="flex gap-4">
          <button onClick={() => setAdminView(!adminView)}><User /></button>
          <button onClick={() => setCartOpen(true)}><ShoppingCart /> ({cart.length})</button>
        </div>
      </header>

      <section className="text-center py-20 px-6">
  <h2
  className="text-5xl font-bold mb-4"
  style={{ color: theme.gold, letterSpacing: "2px", textShadow: "0 0 20px rgba(212,175,55,0.3)" }}
>
    Luxury Within Reach ✨
  </h2>
  <p style={{ color: "#9ca3af" }}>
    Premium Artificial & AD Jewellery crafted for elegance in {brand.city}
  </p>
  </section>

      <div className="max-w-5xl mx-auto px-6 flex gap-4 mb-8">
        <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded">
          <option>All</option><option>Necklace</option><option>Earrings</option><option>Bridal</option>
        </select>
      </div>

      <section className="grid md:grid-cols-3 gap-10 px-6 pb-20 max-w-6xl mx-auto">
        {filteredProducts.map(p => (
          <Card
  key={p.id}
  className="rounded-2xl overflow-hidden relative transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
  style={{
    background: "linear-gradient(145deg, #1a1a22, #14141b)",
    border: "1px solid #2a2a35"
  }}
>
            {p.new && <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">NEW</span>}
            {!p.stock && <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">Out of Stock</span>}
            <img
  src={p.img}
  alt={p.name}
  className="h-48 w-full object-cover rounded-t-2xl"
/>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1" style={{ color: theme.gold }}>
  {p.name}
</h3>
              <p className="font-semibold mb-2" style={{ color: "#e5e5e5" }}>
  ₹{p.price}
</p>
              <div className="flex gap-2 mt-3">
                <Button
  onClick={() => addToCart(p)}
  disabled={!p.stock}
  className="w-full"
  style={{
  background: "linear-gradient(135deg, #d4af37, #f5d76e)",
  color: "#000",
  fontWeight: "600",
  transition: "all 0.3s ease"
}}
>
  Add to Cart
</Button>
                <Button
  variant="outline"
  onClick={() => addToWishlist(p)}
  style={{ borderColor: "#444", color: "#d4af37" }}
>
  <Heart size={16} />
</Button>
              </div>

              <div className="mt-3">
                <Input placeholder="Write a review..." value={newReview} onChange={(e) => setNewReview(e.target.value)} />
                <Button onClick={() => addReview(p.id)} className="mt-2">Post</Button>
                {(reviews[p.id] || []).map((r, i) => <p key={i} className="text-sm mt-1">⭐ {r}</p>)}
              </div>
            </CardContent>
          </Card>
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

      <footer className="text-center mt-20 text-gray-500">
        © {new Date().getFullYear()} {brand.name} · {brand.city}
      </footer>

    </div>
  );
}
