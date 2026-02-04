import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, MessageCircle, User, Heart, BarChart3, FileText } from "lucide-react";

/* LUXURY THEME */
const theme = {
  primary: "#5A2A55", // deep plum
  gold: "#D4AF37",
  blush: "#FFF6F9",
  text: "#2B2B2B",
};

export default function JewelleryWebsite() {
  const brand = { name: "Navya Jewellery", city: "Kolkata" };

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [adminView, setAdminView] = useState(false);

  const [products] = useState([
    { id: 1, name: "Elegant AD Necklace Set", price: 1499, img: "https://images.unsplash.com/photo-1617038260897-41a1f14a2f59" },
    { id: 2, name: "Traditional Kundan Earrings", price: 499, img: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1" },
  ]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const addToCart = (p) => { setCart([...cart, p]); setCartOpen(true); };
  const addToWishlist = (p) => { if (!wishlist.find(w => w.id === p.id)) setWishlist([...wishlist, p]); };

  /* PAYMENT FLOW */
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
    const orderData = { items: cart, total: cart.reduce((s,i)=>s+i.price,0) };
    await fetch("/api/save-order", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(orderData) });
    await fetch("/api/send-whatsapp", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(orderData) });
    setOrders([...orders, orderData]);
    setCart([]);
    setCartOpen(false);
  };

  return (
    <div style={{ background: theme.blush, color: theme.text }} className="min-h-screen">
      <a href="https://wa.me/919876543210" target="_blank" className="fixed bottom-6 right-6 p-4 rounded-full shadow-xl z-50" style={{ background: "#25D366", color: "white" }}>
        <MessageCircle />
      </a>

      <header className="p-6 flex justify-between items-center" style={{ background: theme.primary, color: "white" }}>
        <h1 className="text-2xl font-bold">{brand.name}</h1>
        <div className="flex gap-4">
          <button onClick={()=>setAdminView(!adminView)}><User /></button>
          <button onClick={()=>setCartOpen(true)}><ShoppingCart /> ({cart.length})</button>
        </div>
      </header>

      <section className="text-center py-16">
        <h2 className="text-4xl font-bold mb-2">Luxury Within Reach ✨</h2>
        <p>Proudly serving {brand.city}</p>
      </section>

      {/* PRODUCTS */}
      <section className="grid md:grid-cols-3 gap-8 px-6 pb-16 max-w-6xl mx-auto">
        {products.map(p => (
          <Card key={p.id} className="rounded-2xl shadow-lg overflow-hidden">
            <img src={p.img} className="h-56 w-full object-cover" />
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p style={{ color: theme.gold }} className="font-bold">₹{p.price}</p>
              <div className="flex gap-2 mt-3">
                <Button onClick={()=>addToCart(p)} className="w-full" style={{ background: theme.primary, color: "white" }}>Add</Button>
                <Button variant="outline" onClick={()=>addToWishlist(p)}><Heart size={16}/></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* ADMIN DASHBOARD */}
      {adminView && (
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2"><BarChart3/> Admin Dashboard</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6"><h3>Total Orders</h3><p className="text-2xl font-bold">{orders.length}</p></Card>
            <Card className="p-6"><h3>Total Revenue</h3><p className="text-2xl font-bold">₹{totalRevenue}</p></Card>
            <Card className="p-6"><h3>Wishlist Items</h3><p className="text-2xl font-bold">{wishlist.length}</p></Card>
          </div>
        </section>
      )}

      {/* CART */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div initial={{x:300}} animate={{x:0}} exit={{x:300}} className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl p-6 z-50">
            <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
            {cart.map((item,i)=>(<div key={i} className="flex justify-between"><span>{item.name}</span><span>₹{item.price}</span></div>))}
            <div className="font-bold mt-4">Total ₹{cart.reduce((s,i)=>s+i.price,0)}</div>
            <Button onClick={handlePayment} className="w-full mt-4" style={{ background: theme.gold, color: "black" }}>Pay Securely</Button>
            <Button variant="outline" className="w-full mt-2 flex items-center justify-center gap-2"><FileText size={16}/> Download Invoice</Button>
            <Button variant="outline" className="w-full mt-2" onClick={()=>setCartOpen(false)}>Close</Button>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="text-center py-6 text-sm" style={{ background: theme.primary, color: "white" }}>
        © {new Date().getFullYear()} {brand.name} · {brand.city}
      </footer>
    </div>
  );
}
