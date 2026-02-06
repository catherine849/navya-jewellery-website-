import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  // Get the amount from request body (sent from frontend)
  const { amount, currency = "INR" } = req.body;

  const options = {
    amount: amount * 100, // Convert rupees to paise
    currency: currency,
    receipt: `receipt_${Date.now()}`,
    notes: {
      created_at: new Date().toISOString(),
    }
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
}
