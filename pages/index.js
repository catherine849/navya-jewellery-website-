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
  Search,
  X,
  Plus,
  Minus,
  Instagram
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

/* Elegant Theme - Oh Polly Inspired */
const theme = {
  primary: "#1a1a1a",
  accent: "#c9a961", // Elegant gold
  lightBg: "#fafafa",
  border: "#e5e5e5"
};

export default function JewelleryWebsite() {
  const brand = { name: "NAVYA", city: "Kolkata" };

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [accountOpen, setAccountOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  /* Login */
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [user, setUser] = useState(null);

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
      stock: true
    },
    {
      id: 4,
      name: "Pearl Drop Earrings",
      price: 799,
      img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
      category: "Earrings",
      stock: true,
      new: true
    },
    {
      id: 5,
      name: "Statement Temple Necklace",
      price: 2499,
      img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
      category: "Necklace",
      stock: true
    },
    {
      id: 6,
      name: "Bridal Jhumka Set",
      price: 1299,
      img: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
      category: "Bridal",
      stock: true
    }
  ];

  const filteredProducts = products.filter(p =>
    (category === "All" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const finalTotal = subtotal - subtotal * discount;

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

  const addToWishlist = (p) => {
    if (!wishlist.find(w => w.id === p.id)) {
      setWishlist([...wishlist, p]);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

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

  /* Coupons */
  const applyCoupon = () => {
    if (coupon === "NAVYA10") setDiscount(0.10);
    else if (coupon === "GOLD20") setDiscount(0.20);
    else alert("Invalid coupon");
  };

  /* Payment */
  const handlePayment = async () => {
    try {
      // Create Razorpay order
      const res = await fetch("/api/create-order", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal })
      });
      const data = await res.json();
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY",
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
        theme: { color: theme.primary },
        modal: {
          ondismiss: function() {
            console.log("Payment cancelled");
          }
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
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
        discount: discount > 0 ? discount * 100 + "%" : "None"
      };
      
      // Save order to database
      await fetch("/api/save-order", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(orderData) 
      });
      
      // Send WhatsApp notification
      await fetch("/api/send-whatsapp", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(orderData) 
      });
      
      // Clear cart and close drawer
      setCart([]);
      setCartOpen(false);
      setCoupon("");
      setDiscount(0);
      
      alert("Order placed successfully! 🎉");
    } catch (error) {
      console.error("Order completion error:", error);
      alert("Payment successful but order recording failed. Please contact support.");
    }
  };

  return (
    <div style={{
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: theme.primary
    }}>
      
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          backgroundColor: "#25D366",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(37, 211, 102, 0.4)",
          zIndex: 9998,
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        <MessageCircle size={28} color="white" />
      </a>

      {/* Header */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "white",
        borderBottom: `1px solid ${theme.border}`
      }}>
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          
          {/* Logo */}
          <h1 style={{
            fontSize: "24px",
            fontWeight: "400",
            letterSpacing: "4px",
            color: theme.primary
          }}>
            {brand.name}
          </h1>

          {/* Navigation - Desktop */}
          <nav style={{
            display: "flex",
            gap: "40px",
            fontSize: "13px",
            letterSpacing: "1px",
            textTransform: "uppercase"
          }} className="hidden md:flex">
            {["All", "Necklace", "Earrings", "Bridal"].map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  background: "none",
                  border: "none",
                  color: category === cat ? theme.primary : "#999",
                  cursor: "pointer",
                  fontWeight: category === cat ? "500" : "400",
                  transition: "color 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = theme.primary}
                onMouseLeave={(e) => {
                  if (category !== cat) e.currentTarget.style.color = "#999"
                }}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              onClick={() => setAccountOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px"
              }}
            >
              <User size={20} color={theme.primary} />
            </button>

            <button
              onClick={() => setWishlistOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                position: "relative"
              }}
            >
              <Heart size={20} color={theme.primary} />
              {wishlist.length > 0 && (
                <span style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  width: "16px",
                  height: "16px",
                  backgroundColor: theme.accent,
                  borderRadius: "50%",
                  fontSize: "10px",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
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
                position: "relative"
              }}
            >
              <ShoppingCart size={20} color={theme.primary} />
              {cart.length > 0 && (
                <span style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  width: "16px",
                  height: "16px",
                  backgroundColor: theme.accent,
                  borderRadius: "50%",
                  fontSize: "10px",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        textAlign: "center",
        padding: "80px 32px",
        backgroundColor: theme.lightBg
      }}>
        <h2 style={{
          fontSize: "48px",
          fontWeight: "300",
          marginBottom: "16px",
          color: theme.primary,
          letterSpacing: "2px"
        }}>
          Timeless Elegance
        </h2>
        <p style={{
          fontSize: "16px",
          color: "#666",
          letterSpacing: "1px",
          fontWeight: "300"
        }}>
          Handcrafted Artificial & AD Jewellery from {brand.city}
        </p>
      </section>

      {/* Search Bar */}
      <div style={{
        maxWidth: "600px",
        margin: "0 auto 60px",
        padding: "0 32px"
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          alignItems: "center"
        }}>
          <Search
            size={18}
            color="#999"
            style={{
              position: "absolute",
              left: "16px"
            }}
          />
          <input
            type="text"
            placeholder="Search for jewellery..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px 14px 48px",
              border: `1px solid ${theme.border}`,
              borderRadius: "0",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = theme.primary}
            onBlur={(e) => e.target.style.borderColor = theme.border}
          />
        </div>
      </div>

      {/* Products Grid */}
      <section style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 32px 100px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "40px"
      }}>
        {filteredProducts.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ position: "relative" }}
          >
            {/* New Badge */}
            {p.new && (
              <div style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                backgroundColor: "white",
                padding: "4px 12px",
                fontSize: "11px",
                letterSpacing: "1px",
                zIndex: 10,
                fontWeight: "500"
              }}>
                NEW
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={() => addToWishlist(p)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "white",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              <Heart
                size={18}
                color={wishlist.find(w => w.id === p.id) ? theme.accent : theme.primary}
                fill={wishlist.find(w => w.id === p.id) ? theme.accent : "none"}
              />
            </button>

            {/* Image */}
            <div style={{
              position: "relative",
              paddingBottom: "125%",
              backgroundColor: theme.lightBg,
              overflow: "hidden",
              cursor: "pointer"
            }}>
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
                  transition: "transform 0.6s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              />
            </div>

            {/* Product Info */}
            <div style={{ marginTop: "16px", textAlign: "center" }}>
              <h3 style={{
                fontSize: "14px",
                fontWeight: "400",
                color: theme.primary,
                marginBottom: "8px",
                letterSpacing: "0.5px"
              }}>
                {p.name}
              </h3>
              <p style={{
                fontSize: "15px",
                fontWeight: "500",
                color: theme.primary
              }}>
                ₹{p.price.toLocaleString()}
              </p>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => addToCart(p)}
              disabled={!p.stock}
              style={{
                width: "100%",
                marginTop: "12px",
                padding: "12px",
                backgroundColor: p.stock ? theme.primary : "#ccc",
                color: "white",
                border: "none",
                fontSize: "12px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                cursor: p.stock ? "pointer" : "not-allowed",
                transition: "all 0.3s",
                fontWeight: "500"
              }}
              onMouseEnter={(e) => {
                if (p.stock) e.currentTarget.style.backgroundColor = "#333"
              }}
              onMouseLeave={(e) => {
                if (p.stock) e.currentTarget.style.backgroundColor = theme.primary
              }}
            >
              {p.stock ? "Add to Cart" : "Out of Stock"}
            </button>
          </motion.div>
        ))}
      </section>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Overlay */}
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
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 9998
              }}
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                width: "min(400px, 100vw)",
                height: "100vh",
                backgroundColor: "white",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                boxShadow: "-4px 0 24px rgba(0,0,0,0.1)"
              }}
            >
              {/* Header */}
              <div style={{
                padding: "24px",
                borderBottom: `1px solid ${theme.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <h2 style={{
                  fontSize: "16px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  fontWeight: "500"
                }}>
                  Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </h2>
                <button
                  onClick={() => setCartOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cart Items */}
              <div style={{
                flex: 1,
                overflowY: "auto",
                padding: "24px"
              }}>
                {cart.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#999", marginTop: "40px" }}>
                    Your cart is empty
                  </p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
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
                          width: "80px",
                          height: "100px",
                          objectFit: "cover",
                          backgroundColor: theme.lightBg
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: "14px",
                          marginBottom: "8px",
                          fontWeight: "400"
                        }}>
                          {item.name}
                        </h3>
                        <p style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          marginBottom: "12px"
                        }}>
                          ₹{item.price.toLocaleString()}
                        </p>
                        
                        {/* Quantity Controls */}
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px"
                        }}>
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            style={{
                              width: "28px",
                              height: "28px",
                              border: `1px solid ${theme.border}`,
                              background: "white",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontSize: "14px", minWidth: "20px", textAlign: "center" }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            style={{
                              width: "28px",
                              height: "28px",
                              border: `1px solid ${theme.border}`,
                              background: "white",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            style={{
                              marginLeft: "auto",
                              background: "none",
                              border: "none",
                              color: "#999",
                              cursor: "pointer",
                              fontSize: "12px",
                              textDecoration: "underline"
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div style={{
                  padding: "24px",
                  borderTop: `1px solid ${theme.border}`
                }}>
                  {/* Coupon */}
                  <div style={{
                    display: "flex",
                    gap: "8px",
                    marginBottom: "16px"
                  }}>
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "10px 12px",
                        border: `1px solid ${theme.border}`,
                        fontSize: "13px",
                        outline: "none"
                      }}
                    />
                    <button
                      onClick={applyCoupon}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: theme.primary,
                        color: "white",
                        border: "none",
                        fontSize: "12px",
                        letterSpacing: "1px",
                        cursor: "pointer",
                        textTransform: "uppercase"
                      }}
                    >
                      Apply
                    </button>
                  </div>

                  {discount > 0 && (
                    <p style={{
                      fontSize: "13px",
                      color: "green",
                      marginBottom: "12px"
                    }}>
                      Discount: {(discount * 100)}% off
                    </p>
                  )}

                  {/* Total */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                    fontSize: "16px",
                    fontWeight: "500"
                  }}>
                    <span>Total</span>
                    <span>₹{finalTotal.toLocaleString()}</span>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handlePayment}
                    style={{
                      width: "100%",
                      padding: "16px",
                      backgroundColor: theme.primary,
                      color: "white",
                      border: "none",
                      fontSize: "13px",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      fontWeight: "500"
                    }}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Account Drawer */}
      <AnimatePresence>
        {accountOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAccountOpen(false)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 9998
              }}
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                width: "min(400px, 100vw)",
                height: "100vh",
                backgroundColor: "white",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                boxShadow: "-4px 0 24px rgba(0,0,0,0.1)"
              }}
            >
              <div style={{
                padding: "24px",
                borderBottom: `1px solid ${theme.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <h2 style={{
                  fontSize: "16px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  fontWeight: "500"
                }}>
                  My Account
                </h2>
                <button
                  onClick={() => setAccountOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: "24px" }}>
                {!user ? (
                  <>
                    <input
                      type="tel"
                      placeholder="+91 Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: `1px solid ${theme.border}`,
                        marginBottom: "12px",
                        fontSize: "14px",
                        outline: "none"
                      }}
                    />
                    <button
                      onClick={sendOTP}
                      style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: theme.primary,
                        color: "white",
                        border: "none",
                        fontSize: "13px",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        marginBottom: "16px"
                      }}
                    >
                      Send OTP
                    </button>
                    
                    {confirmation && (
                      <>
                        <input
                          type="text"
                          placeholder="Enter OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px",
                            border: `1px solid ${theme.border}`,
                            marginBottom: "12px",
                            fontSize: "14px",
                            outline: "none"
                          }}
                        />
                        <button
                          onClick={verifyOTP}
                          style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: theme.primary,
                            color: "white",
                            border: "none",
                            fontSize: "13px",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            cursor: "pointer"
                          }}
                        >
                          Verify & Login
                        </button>
                      </>
                    )}
                    <div id="recaptcha-container"></div>
                  </>
                ) : (
                  <div style={{
                    textAlign: "center",
                    padding: "40px 0",
                    color: "green"
                  }}>
                    <p style={{ fontSize: "16px", marginBottom: "8px" }}>✓ Logged In</p>
                    <p style={{ fontSize: "14px", color: "#666" }}>Welcome back!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Wishlist Drawer */}
      <AnimatePresence>
        {wishlistOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setWishlistOpen(false)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 9998
              }}
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                width: "min(400px, 100vw)",
                height: "100vh",
                backgroundColor: "white",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                boxShadow: "-4px 0 24px rgba(0,0,0,0.1)"
              }}
            >
              <div style={{
                padding: "24px",
                borderBottom: `1px solid ${theme.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <h2 style={{
                  fontSize: "16px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  fontWeight: "500"
                }}>
                  Wishlist ({wishlist.length})
                </h2>
                <button
                  onClick={() => setWishlistOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{
                flex: 1,
                overflowY: "auto",
                padding: "24px"
              }}>
                {wishlist.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#999", marginTop: "40px" }}>
                    Your wishlist is empty
                  </p>
                ) : (
                  wishlist.map((item) => (
                    <div
                      key={item.id}
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
                          width: "80px",
                          height: "100px",
                          objectFit: "cover",
                          backgroundColor: theme.lightBg
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: "14px",
                          marginBottom: "8px",
                          fontWeight: "400"
                        }}>
                          {item.name}
                        </h3>
                        <p style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          marginBottom: "12px"
                        }}>
                          ₹{item.price.toLocaleString()}
                        </p>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => {
                              addToCart(item);
                              removeFromWishlist(item.id);
                            }}
                            style={{
                              padding: "8px 16px",
                              backgroundColor: theme.primary,
                              color: "white",
                              border: "none",
                              fontSize: "11px",
                              letterSpacing: "1px",
                              textTransform: "uppercase",
                              cursor: "pointer"
                            }}
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            style={{
                              padding: "8px 16px",
                              backgroundColor: "white",
                              color: theme.primary,
                              border: `1px solid ${theme.border}`,
                              fontSize: "11px",
                              letterSpacing: "1px",
                              textTransform: "uppercase",
                              cursor: "pointer"
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer style={{
        backgroundColor: theme.primary,
        color: "white",
        padding: "60px 32px",
        marginTop: "80px"
      }}>
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "40px"
        }}>
          <div>
            <h3 style={{
              fontSize: "18px",
              letterSpacing: "3px",
              marginBottom: "16px",
              fontWeight: "400"
            }}>
              {brand.name}
            </h3>
            <p style={{
              fontSize: "14px",
              color: "#999",
              lineHeight: "1.6"
            }}>
              Exquisite artificial and AD jewellery handcrafted with love in {brand.city}.
            </p>
          </div>

          <div>
            <h4 style={{
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "16px",
              fontWeight: "500"
            }}>
              Shop
            </h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {["Necklaces", "Earrings", "Bridal Collection", "New Arrivals"].map(item => (
                <li key={item} style={{ marginBottom: "8px" }}>
                  <a href="#" style={{
                    color: "#999",
                    textDecoration: "none",
                    fontSize: "14px",
                    transition: "color 0.2s"
                  }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "16px",
              fontWeight: "500"
            }}>
              Follow Us
            </h4>
            <div style={{ display: "flex", gap: "16px" }}>
              <a href="#" style={{ color: "white" }}>
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: "1400px",
          margin: "40px auto 0",
          paddingTop: "24px",
          borderTop: "1px solid #333",
          textAlign: "center",
          fontSize: "12px",
          color: "#666"
        }}>
          © {new Date().getFullYear()} {brand.name}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
