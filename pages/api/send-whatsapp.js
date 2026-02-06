import twilio from "twilio";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const order = req.body;

  // Format order details nicely
  const itemsList = order.items
    .map((item, i) => `${i + 1}. ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`)
    .join('\n');

  const message = `
🛍️ *New Order Received!*

*Order Details:*
${itemsList}

*Total Amount:* ₹${order.total}

*Order ID:* ${order.orderId || 'N/A'}
*Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

---
NAVYA Jewellery
  `.trim();

  try {
    await client.messages.create({
      body: message,
      from: "whatsapp:+14155238886", // Twilio sandbox number
      to: process.env.WHATSAPP_NUMBER || "whatsapp:+919876543210" // Your WhatsApp number
    });

    res.status(200).json({ success: true, message: "WhatsApp notification sent" });
  } catch (err) {
    console.error("WhatsApp send error:", err);
    res.status(500).json({ error: "WhatsApp notification failed" });
  }
}
