import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  MessageCircle,
  User,
  Heart,
  Search,
  X,
  Plus,
  Minus,
  Instagram,
  ChevronLeft,
  ChevronRight,
  Star,
  Package,
  Shield,
  Truck
} from "lucide-react";

/* Firebase OTP Login */
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* Refined Luxury Theme - Giva Inspired */
const theme = {
  primary: "#1a1613",
  accent: "#d4af37", // Luxe gold
  rose: "#b76e79", // Rose gold accent
  cream: "#faf8f5",
  lightGold: "#f5e6d3",
  border: "#e8e3dc",
  gray: "#6b6b6b"
};

export default function NavyaJewellery() {
  const brand = { 
    name: "NAVYA", 
    tagline: "Curated Elegance from Kolkata",
    city: "Kolkata" 
  };

  // State Management
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [accountOpen, setAccountOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);
  
  /* Login */
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [user, setUser] = useState(null);

  /* Coupons */
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  // Hero Carousel
  const heroSlides = [
    {
      title: "Bridal Splendor",
      subtitle: "Exquisite pieces for your special day",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1600&auto=format&fit=crop",
      cta: "Shop Bridal"
    },
    {
      title: "Timeless Classics",
      subtitle: "Handcrafted AD jewellery that lasts",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600&auto=format&fit=crop",
      cta: "Explore Collection"
    },
    {
      title: "Modern Elegance",
      subtitle: "Contemporary designs for every occasion",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1600&auto=format&fit=crop",
      cta: "Shop Now"
    }
  ];

  // Enhanced Product Data
  const products = [
    {
  id: 1,
  name: "Product Name",
  price: 1499,
  originalPrice: 1999,  // Shows discount
  img: "https://images.unsplash.com/photo-1617038260897-41a1f14a2f59?q=80&w=800&auto=format&fit=crop",
  category: "Necklace"
  stock: true,
  new: true,            // Shows "NEW" badge
  bestseller: true,     // Shows "BESTSELLER" badge
  rating: 4.8,          // Out of 5
  reviews: 124,         // Number of reviews
  description: "Stunning American Diamond necklace set with intricate detailing. Perfect for weddings and special occasions."
}
    {
      id: 2,
      name: "Traditional Kundan Earrings",
      price: 499,
      originalPrice: 699,  // Shows discount
      img: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop",
      category: "Earrings",
      stock: true,
      new: true,            // Shows "NEW" badge
      bestseller: true,     // Shows "BESTSELLER" badge
      rating: 4.9,          // Out of 5
      reviews: 89,         // Number of reviews
      description: "Handcrafted Kundan earrings with traditional design. Lightweight and comfortable for all-day wear."
    },
    {
      id: 3,
      name: "Bridal Choker Set",
      price: 1999,
      originalPrice: 2799,  // Shows discount
      img: "https://images.unsplash.com/photo-1627295116034-7c6c1c3c3b02?q=80&w=800&auto=format&fit=crop",
      category: "Bridal",
      stock: true,
      new: true,            // Shows "NEW" badge
      bestseller: true,     // Shows "BESTSELLER" badge
      rating: 5.0,          // Out of 5
      reviews: 203,         // Number of reviews
      description: "Complete bridal choker set with matching earrings. Crafted with premium quality stones and materials."
    },
    {
      id: 4,
      name: "Pearl Drop Earrings",
      price: 799,
      originalPrice: 1099,  // Shows discount
      img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
      category: "Earrings",
      stock: true,
      rating: 4.7,          // Out of 5
      reviews: 67,         // Number of reviews
      description: "Elegant pearl drop earrings with gold-tone finish. Perfect for both casual and formal occasions."
    },
    {
      id: 5,
      name: "Statement Temple Necklace",
      price: 2499,
      originalPrice: 3299,  // Shows discount
      img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
      category: "Necklace",
      stock: true,
      rating: 4.9,          // Out of 5
      reviews: 156,         // Number of reviews
      description: "Grand temple jewelry necklace with intricate goddess motifs. A statement piece for festive celebrations."
    },
    {
      id: 6,
      name: "Bridal Jhumka Set",
      price: 1299,
      originalPrice: 1799,  // Shows discount
      img: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
      category: "Bridal",
      stock: true,
      bestseller: true,
      rating: 4.8,          // Out of 5
      reviews: 178,         // Number of reviews
      description: "Traditional jhumka earrings with delicate pearl drops. Essential bridal accessory with timeless appeal."
    }
  ];

  const filteredProducts = products.filter(p =>
    (category === "All" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const finalTotal = subtotal - subtotal * discount;

  // Auto-rotate hero
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Cart Functions
  const addToCart = (p) => {
    const existing = cart.find(item => item.id === p.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === p.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...p, quantity: 1 }]);
    }
    setCartOpen(true);
  };

  const updateQuantity = (id, change) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    ).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Wishlist Functions
  const addToWishlist = (p) => {
    if (!wishlist.find(w => w.id === p.id)) {
      setWishlist([...wishlist, p]);
    } else {
      removeFromWishlist(p.id);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  /* OTP Authentication */
  const sendOTP = async () => {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: "invisible" });
      const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmation(result);
    } catch (error) {
      console.error("OTP send error:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };
  
  const verifyOTP = async () => {
    try {
      const result = await confirmation.confirm(otp);
      setUser(result.user);
      setAccountOpen(false);
    } catch (error) {
      console.error("OTP verification error:", error);
      alert("Invalid OTP. Please try again.");
    }
  };

  /* Coupon System */
  const applyCoupon = () => {
    const coupons = {
      "NAVYA10": 0.10,
      "GOLD20": 0.20,
      "WELCOME15": 0.15,
      "BRIDAL25": 0.25
    };
    
    if (coupons[coupon.toUpperCase()]) {
      setDiscount(coupons[coupon.toUpperCase()]);
    } else {
      alert("Invalid coupon code");
    }
  };

  /* Payment Integration */
  const handlePayment = async () => {
    if (!user) {
      alert("Please login first to proceed with checkout");
      setAccountOpen(true);
      return;
    }

    try {
      const res = await fetch("/api/create-order", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal })
      });
      const data = await res.json();
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: brand.name,
        description: "Jewellery Purchase",
        order_id: data.id,
        handler: function (response) { 
          completeOrder(response.razorpay_payment_id, data.id); 
        },
        prefill: {
          name: user?.displayName || "",
          contact: phone
        },
        theme: { color: theme.primary }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  const completeOrder = async (paymentId, orderId) => {
    try {
      const orderData = { 
        items: cart, 
        total: finalTotal,
        paymentId,
        orderId,
        customerPhone: phone,
        discount: discount > 0 ? (discount * 100) + "%" : "None"
      };
      
      await fetch("/api/save-order", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(orderData) 
      });
      
      await fetch("/api/send-whatsapp", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(orderData) 
      });
      
      setCart([]);
      setCartOpen(false);
      setCoupon("");
      setDiscount(0);
      
      alert("Order placed successfully! 🎉 You'll receive a confirmation message shortly.");
    } catch (error) {
      console.error("Order error:", error);
      alert("Payment successful! Please contact us for order confirmation.");
    }
  };

  return (
    <div style={{
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      fontFamily: "'Cormorant Garamond', 'Georgia', serif",
      color: theme.primary
    }}>
      
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919876543210?text=Hi! I'm interested in your jewellery collection"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          width: "60px",
          height: "60px",
          backgroundColor: "#25D366",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 20px rgba(37, 211, 102, 0.4)",
          zIndex: 9998,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1) translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(37, 211, 102, 0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1) translateY(0)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(37, 211, 102, 0.4)";
        }}
      >
        <MessageCircle size={30} color="white" strokeWidth={2} />
      </a>

      {/* Header */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${theme.border}`,
        transition: "all 0.3s ease"
      }}>
        {/* Announcement Bar */}
        <div style={{
          backgroundColor: theme.primary,
          color: "white",
          textAlign: "center",
          padding: "8px 20px",
          fontSize: "12px",
          letterSpacing: "0.5px",
          fontFamily: "'Inter', sans-serif"
        }}>
          ✨ Free Shipping on Orders Above ₹1,499 | Use Code: WELCOME15 for 15% Off
        </div>

        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "18px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          
          {/* Logo */}
          <div>
            <h1 style={{
              fontSize: "28px",
              fontWeight: "400",
              letterSpacing: "3px",
              color: theme.primary,
              marginBottom: "2px"
            }}>
              {brand.name}
            </h1>
            <p style={{
              fontSize: "9px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: theme.gray,
              fontFamily: "'Inter', sans-serif",
              fontWeight: "300"
            }}>
              {brand.tagline}
            </p>
          </div>

          {/* Navigation - Desktop */}
          <nav style={{
            display: "flex",
            gap: "48px",
            fontSize: "13px",
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            fontFamily: "'Inter', sans-serif"
          }} className="hidden md:flex">
            {["All", "Necklace", "Earrings", "Bridal"].map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  background: "none",
                  border: "none",
                  color: category === cat ? theme.primary : theme.gray,
                  cursor: "pointer",
                  fontWeight: category === cat ? "500" : "400",
                  transition: "color 0.3s ease",
                  position: "relative",
                  paddingBottom: "4px"
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = theme.primary}
                onMouseLeave={(e) => {
                  if (category !== cat) e.currentTarget.style.color = theme.gray
                }}
              >
                {cat}
                {category === cat && (
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    backgroundColor: theme.accent
                  }} />
                )}
              </button>
            ))}
          </nav>

          {/* Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <button
              onClick={() => setAccountOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                position: "relative",
                transition: "transform 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <User size={21} color={theme.primary} strokeWidth={1.5} />
              {user && (
                <span style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#22c55e",
                  borderRadius: "50%",
                  border: "2px solid white"
                }} />
              )}
            </button>

            <button
              onClick={() => setWishlistOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                position: "relative",
                transition: "transform 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <Heart size={21} color={theme.primary} strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  minWidth: "18px",
                  height: "18px",
                  backgroundColor: theme.rose,
                  borderRadius: "10px",
                  fontSize: "10px",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: "600",
                  padding: "0 5px"
                }}>
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setCartOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                position: "relative",
                transition: "transform 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <ShoppingCart size={21} color={theme.primary} strokeWidth={1.5} />
              {cart.length > 0 && (
                <span style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  minWidth: "18px",
                  height: "18px",
                  backgroundColor: theme.accent,
                  borderRadius: "10px",
                  fontSize: "10px",
                  color: theme.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: "600",
                  padding: "0 5px"
                }}>
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Carousel */}
      <section style={{
        position: "relative",
        height: "75vh",
        minHeight: "500px",
        overflow: "hidden",
        backgroundColor: theme.cream
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url(${heroSlides[heroIndex].image})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "white",
              width: "90%",
              maxWidth: "800px"
            }}>
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                style={{
                  fontSize: "clamp(40px, 6vw, 72px)",
                  fontWeight: "300",
                  marginBottom: "16px",
                  letterSpacing: "2px",
                  textShadow: "0 2px 20px rgba(0,0,0,0.3)"
                }}
              >
                {heroSlides[heroIndex].title}
              </motion.h2>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                style={{
                  fontSize: "clamp(16px, 2vw, 22px)",
                  marginBottom: "32px",
                  letterSpacing: "1px",
                  fontWeight: "300",
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                {heroSlides[heroIndex].subtitle}
              </motion.p>
              <motion.button
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                onClick={() => setCategory(heroSlides[heroIndex].cta.includes("Bridal") ? "Bridal" : "All")}
                style={{
                  padding: "16px 48px",
                  backgroundColor: "white",
                  color: theme.primary,
                  border: "none",
                  fontSize: "13px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.accent;
                  e.currentTarget.style.color = theme.primary;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 25px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = theme.primary;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
                }}
              >
                {heroSlides[heroIndex].cta}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        <button
          onClick={() => setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          style={{
            position: "absolute",
            left: "24px",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "none",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          <ChevronLeft size={24} color={theme.primary} />
        </button>

        <button
          onClick={() => setHeroIndex((prev) => (prev + 1) % heroSlides.length)}
          style={{
            position: "absolute",
            right: "24px",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "none",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          <ChevronRight size={24} color={theme.primary} />
        </button>

        {/* Carousel Indicators */}
        <div style={{
          position: "absolute",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "12px"
        }}>
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIndex(idx)}
              style={{
                width: idx === heroIndex ? "40px" : "12px",
                height: "4px",
                backgroundColor: idx === heroIndex ? "white" : "rgba(255, 255, 255, 0.5)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                borderRadius: "2px"
              }}
            />
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{
        backgroundColor: theme.cream,
        padding: "48px 40px",
        borderBottom: `1px solid ${theme.border}`
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "40px",
          textAlign: "center"
        }}>
          {[
            { icon: Truck, title: "Free Shipping", desc: "On orders above ₹1,499" },
            { icon: Shield, title: "Secure Payments", desc: "100% safe & encrypted" },
            { icon: Package, title: "Premium Packaging", desc: "Elegant gift wrapping" }
          ].map(({ icon: Icon, title, desc }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px"
              }}
            >
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
              }}>
                <Icon size={24} color={theme.accent} strokeWidth={1.5} />
              </div>
              <h3 style={{
                fontSize: "15px",
                fontWeight: "500",
                letterSpacing: "0.5px",
                fontFamily: "'Inter', sans-serif",
                color: theme.primary
              }}>
                {title}
              </h3>
              <p style={{
                fontSize: "13px",
                color: theme.gray,
                fontFamily: "'Inter', sans-serif",
                fontWeight: "300"
              }}>
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Search Bar */}
      <div style={{
        maxWidth: "600px",
        margin: "60px auto",
        padding: "0 40px"
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          alignItems: "center"
        }}>
          <Search
            size={18}
            color={theme.gray}
            style={{
              position: "absolute",
              left: "18px"
            }}
          />
          <input
            type="text"
            placeholder="Search for necklaces, earrings, bridal sets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "16px 20px 16px 52px",
              border: `1px solid ${theme.border}`,
              borderRadius: "50px",
              fontSize: "14px",
              fontFamily: "'Inter', sans-serif",
              color: theme.primary,
              outline: "none",
              transition: "all 0.3s ease",
              backgroundColor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = theme.accent;
              e.target.style.boxShadow = "0 4px 16px rgba(212, 175, 55, 0.15)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = theme.border;
              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
            }}
          />
        </div>
      </div>

      {/* Products Section */}
      <section style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 40px 120px"
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "60px"
        }}>
          <h2 style={{
            fontSize: "42px",
            fontWeight: "300",
            letterSpacing: "1px",
            marginBottom: "12px",
            color: theme.primary
          }}>
            Our Collection
          </h2>
          <p style={{
            fontSize: "16px",
            color: theme.gray,
            fontFamily: "'Inter', sans-serif",
            fontWeight: "300"
          }}>
            Handcrafted with love, designed for elegance
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "48px"
        }}>
          {filteredProducts.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              style={{ 
                position: "relative",
                cursor: "pointer"
              }}
            >
              {/* Badges */}
              <div style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                zIndex: 10
              }}>
                {p.new && (
                  <span style={{
                    backgroundColor: theme.accent,
                    color: theme.primary,
                    padding: "6px 14px",
                    fontSize: "10px",
                    letterSpacing: "1.5px",
                    fontWeight: "600",
                    fontFamily: "'Inter', sans-serif",
                    textTransform: "uppercase",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}>
                    New
                  </span>
                )}
                {p.bestseller && (
                  <span style={{
                    backgroundColor: theme.rose,
                    color: "white",
                    padding: "6px 14px",
                    fontSize: "10px",
                    letterSpacing: "1.5px",
                    fontWeight: "600",
                    fontFamily: "'Inter', sans-serif",
                    textTransform: "uppercase",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}>
                    Bestseller
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => addToWishlist(p)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 10,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                <Heart
                  size={18}
                  color={wishlist.find(w => w.id === p.id) ? theme.rose : theme.gray}
                  fill={wishlist.find(w => w.id === p.id) ? theme.rose : "none"}
                  strokeWidth={2}
                />
              </button>

              {/* Image Container */}
              <div 
                onClick={() => setQuickViewProduct(p)}
                style={{
                  position: "relative",
                  paddingBottom: "133%",
                  backgroundColor: theme.cream,
                  overflow: "hidden",
                  borderRadius: "4px"
                }}
              >
                <img
                  src={p.img}
                  alt={p.name}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                />
                
                {/* Quick View Overlay */}
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "20px",
                  background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                  opacity: 0,
                  transition: "opacity 0.3s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "0"}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickViewProduct(p);
                    }}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "white",
                      color: theme.primary,
                      border: "none",
                      fontSize: "11px",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: "500",
                      cursor: "pointer",
                      borderRadius: "2px",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                    }}
                  >
                    Quick View
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div style={{ marginTop: "20px" }}>
                {/* Rating */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "8px",
                  justifyContent: "center"
                }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      fill={i < Math.floor(p.rating) ? theme.accent : "none"}
                      color={i < Math.floor(p.rating) ? theme.accent : theme.border}
                      strokeWidth={1.5}
                    />
                  ))}
                  <span style={{
                    fontSize: "11px",
                    color: theme.gray,
                    fontFamily: "'Inter', sans-serif",
                    marginLeft: "4px"
                  }}>
                    ({p.reviews})
                  </span>
                </div>

                <h3 style={{
                  fontSize: "17px",
                  fontWeight: "400",
                  color: theme.primary,
                  marginBottom: "10px",
                  letterSpacing: "0.3px",
                  textAlign: "center",
                  lineHeight: "1.4"
                }}>
                  {p.name}
                </h3>
                
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "center",
                  marginBottom: "16px"
                }}>
                  <p style={{
                    fontSize: "20px",
                    fontWeight: "400",
                    color: theme.primary
                  }}>
                    ₹{p.price.toLocaleString()}
                  </p>
                  {p.originalPrice && (
                    <>
                      <p style={{
                        fontSize: "15px",
                        color: theme.gray,
                        textDecoration: "line-through",
                        fontWeight: "300"
                      }}>
                        ₹{p.originalPrice.toLocaleString()}
                      </p>
                      <span style={{
                        fontSize: "11px",
                        color: theme.rose,
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: "600"
                      }}>
                        {Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart(p)}
                disabled={!p.stock}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: p.stock ? theme.primary : "#e5e5e5",
                  color: p.stock ? "white" : theme.gray,
                  border: "none",
                  fontSize: "11px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  cursor: p.stock ? "pointer" : "not-allowed",
                  transition: "all 0.3s ease",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: "500",
                  borderRadius: "2px"
                }}
                onMouseEnter={(e) => {
                  if (p.stock) {
                    e.currentTarget.style.backgroundColor = theme.accent;
                    e.currentTarget.style.color = theme.primary;
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (p.stock) {
                    e.currentTarget.style.backgroundColor = theme.primary;
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                {p.stock ? "Add to Cart" : "Out of Stock"}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewProduct(null)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px"
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  maxWidth: "900px",
                  width: "100%",
                  maxHeight: "90vh",
                  overflow: "auto",
                  position: "relative"
                }}
              >
                <button
                  onClick={() => setQuickViewProduct(null)}
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    background: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 10,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.1)"
                  }}
                >
                  <X size={20} color={theme.primary} />
                </button>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "40px",
                  padding: "40px"
                }}>
                  {/* Image */}
                  <div style={{
                    position: "relative",
                    paddingBottom: "133%",
                    backgroundColor: theme.cream,
                    borderRadius: "4px",
                    overflow: "hidden"
                  }}>
                    <img
                      src={quickViewProduct.img}
                      alt={quickViewProduct.name}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px"
                  }}>
                    <div>
                      <h2 style={{
                        fontSize: "32px",
                        fontWeight: "300",
                        marginBottom: "12px",
                        color: theme.primary,
                        letterSpacing: "0.5px"
                      }}>
                        {quickViewProduct.name}
                      </h2>
                      
                      {/* Rating */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "16px"
                      }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < Math.floor(quickViewProduct.rating) ? theme.accent : "none"}
                            color={i < Math.floor(quickViewProduct.rating) ? theme.accent : theme.border}
                            strokeWidth={1.5}
                          />
                        ))}
                        <span style={{
                          fontSize: "13px",
                          color: theme.gray,
                          fontFamily: "'Inter', sans-serif"
                        }}>
                          {quickViewProduct.rating} ({quickViewProduct.reviews} reviews)
                        </span>
                      </div>

                      {/* Price */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "20px"
                      }}>
                        <span style={{
                          fontSize: "28px",
                          fontWeight: "400",
                          color: theme.primary
                        }}>
                          ₹{quickViewProduct.price.toLocaleString()}
                        </span>
                        {quickViewProduct.originalPrice && (
                          <>
                            <span style={{
                              fontSize: "18px",
                              color: theme.gray,
                              textDecoration: "line-through",
                              fontWeight: "300"
                            }}>
                              ₹{quickViewProduct.originalPrice.toLocaleString()}
                            </span>
                            <span style={{
                              fontSize: "12px",
                              color: theme.rose,
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: "600",
                              padding: "4px 10px",
                              backgroundColor: theme.lightGold,
                              borderRadius: "4px"
                            }}>
                              {Math.round(((quickViewProduct.originalPrice - quickViewProduct.price) / quickViewProduct.originalPrice) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <p style={{
                      fontSize: "15px",
                      lineHeight: "1.7",
                      color: theme.gray,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: "300"
                    }}>
                      {quickViewProduct.description}
                    </p>

                    <div style={{
                      padding: "20px",
                      backgroundColor: theme.cream,
                      borderRadius: "4px",
                      border: `1px solid ${theme.border}`
                    }}>
                      <p style={{
                        fontSize: "13px",
                        color: theme.gray,
                        fontFamily: "'Inter', sans-serif",
                        lineHeight: "1.6"
                      }}>
                        ✓ Handcrafted with premium materials<br/>
                        ✓ Free shipping on orders above ₹1,499<br/>
                        ✓ 7-day easy returns & exchange<br/>
                        ✓ Elegant gift packaging included
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(quickViewProduct);
                        setQuickViewProduct(null);
                      }}
                      style={{
                        width: "100%",
                        padding: "18px",
                        backgroundColor: theme.primary,
                        color: "white",
                        border: "none",
                        fontSize: "13px",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: "500",
                        borderRadius: "4px",
                        transition: "all 0.3s ease",
                        marginTop: "auto"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.accent;
                        e.currentTarget.style.color = theme.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme.primary;
                        e.currentTarget.style.color = "white";
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                zIndex: 9998
              }}
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                width: "min(450px, 100vw)",
                height: "100vh",
                backgroundColor: "white",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                boxShadow: "-8px 0 24px rgba(0,0,0,0.15)"
              }}
            >
              {/* Header */}
              <div style={{
                padding: "28px 32px",
                borderBottom: `1px solid ${theme.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: theme.cream
              }}>
                <div>
                  <h2 style={{
                    fontSize: "20px",
                    letterSpacing: "1px",
                    fontWeight: "400",
                    marginBottom: "4px"
                  }}>
                    Shopping Cart
                  </h2>
                  <p style={{
                    fontSize: "13px",
                    color: theme.gray,
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} {cart.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  style={{
                    background: "white",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.primary;
                    e.currentTarget.style.borderColor = theme.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.borderColor = theme.border;
                  }}
                >
                  <X size={18} color={theme.primary} />
                </button>
              </div>

              {/* Cart Items */}
              <div style={{
                flex: 1,
                overflowY: "auto",
                padding: "24px 32px"
              }}>
                {cart.length === 0 ? (
                  <div style={{
                    textAlign: "center",
                    padding: "60px 20px"
                  }}>
                    <ShoppingCart 
                      size={48} 
                      color={theme.border} 
                      strokeWidth={1}
                      style={{ marginBottom: "16px" }}
                    />
                    <p style={{
                      color: theme.gray,
                      fontSize: "15px",
                      fontFamily: "'Inter', sans-serif"
                    }}>
                      Your cart is empty
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      style={{
                        display: "flex",
                        gap: "16px",
                        marginBottom: "24px",
                        paddingBottom: "24px",
                        borderBottom: `1px solid ${theme.border}`
                      }}
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        style={{
                          width: "90px",
                          height: "120px",
                          objectFit: "cover",
                          backgroundColor: theme.cream,
                          borderRadius: "4px"
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: "15px",
                          marginBottom: "6px",
                          fontWeight: "400",
                          letterSpacing: "0.3px"
                        }}>
                          {item.name}
                        </h3>
                        <p style={{
                          fontSize: "15px",
                          fontWeight: "400",
                          marginBottom: "14px",
                          color: theme.primary
                        }}>
                          ₹{item.price.toLocaleString()}
                        </p>
                        
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            border: `1px solid ${theme.border}`,
                            borderRadius: "4px",
                            padding: "4px"
                          }}>
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              style={{
                                width: "32px",
                                height: "32px",
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s ease"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.cream}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                              <Minus size={14} color={theme.primary} />
                            </button>
                            <span style={{
                              fontSize: "14px",
                              minWidth: "24px",
                              textAlign: "center",
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: "500"
                            }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              style={{
                                width: "32px",
                                height: "32px",
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s ease"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.cream}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                              <Plus size={14} color={theme.primary} />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: theme.gray,
                              cursor: "pointer",
                              fontSize: "12px",
                              fontFamily: "'Inter', sans-serif",
                              textDecoration: "underline",
                              transition: "color 0.2s ease"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = theme.rose}
                            onMouseLeave={(e) => e.currentTarget.style.color = theme.gray}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
<footer style={{
  backgroundColor: theme.primary,
  color: "white",
  padding: "80px 40px 40px",  // Notice: "80px 40px 40px" (different padding)
  marginTop: "120px"          // Notice: "120px" (different margin)
}}>
  <div style={{
    maxWidth: "1400px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "60px",              // Notice: "60px" gap
    marginBottom: "60px"
  }}>
    <div>
      <h3 style={{
        fontSize: "24px",      // Notice: "24px" (larger)
        letterSpacing: "2px",
        marginBottom: "12px",
        fontWeight: "300"
      }}>
        {brand.name}
      </h3>
      <p style={{
        fontSize: "11px",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.6)",
        marginBottom: "20px",
        fontFamily: "'Inter', sans-serif"
      }}>
        {brand.tagline}        // Notice: Has tagline
      </p>
      <p style={{
        fontSize: "14px",
        color: "rgba(255,255,255,0.7)",
        lineHeight: "1.7",
        fontFamily: "'Inter', sans-serif",
        fontWeight: "300"
      }}>
        Exquisite artificial and AD jewellery handcrafted with love in {brand.city}. Each piece tells a story of elegance and timeless beauty.
      </p>
    </div>

    <div>
      <h4 style={{
        fontSize: "13px",
        letterSpacing: "2px",
        textTransform: "uppercase",
        marginBottom: "20px",
        fontWeight: "500",
        fontFamily: "'Inter', sans-serif",
        color: "rgba(255,255,255,0.9)"
      }}>
        Shop
      </h4>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {["All Jewellery", "Necklaces", "Earrings", "Bridal Collection", "New Arrivals", "Bestsellers"].map(item => (
          <li key={item} style={{ marginBottom: "12px" }}>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setCategory(item.includes("Necklace") ? "Necklace" : item.includes("Earring") ? "Earrings" : item.includes("Bridal") ? "Bridal" : "All");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none",
                fontSize: "14px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: "300",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = theme.accent}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>

    <div>
      <h4 style={{
        fontSize: "13px",
        letterSpacing: "2px",
        textTransform: "uppercase",
        marginBottom: "20px",
        fontWeight: "500",
        fontFamily: "'Inter', sans-serif",
        color: "rgba(255,255,255,0.9)"
      }}>
        Customer Care
      </h4>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {["Contact Us", "Shipping & Returns", "Size Guide", "Care Instructions", "FAQs", "Track Order"].map(item => (
          <li key={item} style={{ marginBottom: "12px" }}>
            <a href="#" style={{
              color: "rgba(255,255,255,0.7)",
              textDecoration: "none",
              fontSize: "14px",
              fontFamily: "'Inter', sans-serif",
              fontWeight: "300",
              transition: "color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = theme.accent}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>

    <div>
      <h4 style={{
        fontSize: "13px",
        letterSpacing: "2px",
        textTransform: "uppercase",
        marginBottom: "20px",
        fontWeight: "500",
        fontFamily: "'Inter', sans-serif",
        color: "rgba(255,255,255,0.9)"
      }}>
        Connect With Us
      </h4>
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        <a 
          href="https://instagram.com/navya_jewellery" 
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.accent;
            e.currentTarget.style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Instagram size={18} color="white" />
        </a>
      </div>
      <a 
        href="mailto:navnil.commercial@gmail.com"
        style={{
          color: "rgba(255,255,255,0.7)",
          fontSize: "14px",
          textDecoration: "none",
          fontFamily: "'Inter', sans-serif",
          fontWeight: "300",
          transition: "color 0.2s",
          display: "block",
          marginBottom: "12px"
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = theme.accent}
        onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
      >
        navnil.commercial@gmail.com
      </a>
      <p style={{
        color: "rgba(255,255,255,0.7)",
        fontSize: "14px",
        fontFamily: "'Inter', sans-serif",
        fontWeight: "300"
      }}>
        +91 98765 43210
      </p>
    </div>
  </div>

  <div style={{
    maxWidth: "1400px",
    margin: "0 auto",
    paddingTop: "40px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px"
  }}>
    <p style={{
      fontSize: "13px",
      color: "rgba(255,255,255,0.5)",
      fontFamily: "'Inter', sans-serif",
      fontWeight: "300"
    }}>
      © {new Date().getFullYear()} {brand.name}. All rights reserved.
    </p>
    <div style={{
      display: "flex",
      gap: "24px",
      fontSize: "13px"
    }}>
      <a href="#" style={{
        color: "rgba(255,255,255,0.5)",
        textDecoration: "none",
        fontFamily: "'Inter', sans-serif",
        fontWeight: "300",
        transition: "color 0.2s"
      }}
      onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.9)"}
      onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
      >
        Privacy Policy
      </a>
      <a href="#" style={{
        color: "rgba(255,255,255,0.5)",
        textDecoration: "none",
        fontFamily: "'Inter', sans-serif",
        fontWeight: "300",
        transition: "color 0.2s"
      }}
      onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.9)"}
      onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
      >
        Terms of Service
      </a>
    </div>
  </div>
</footer>
