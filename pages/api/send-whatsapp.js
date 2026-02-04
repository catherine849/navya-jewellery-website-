import twilio from "twilio";

export default async function handler(req, res) {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const order = req.body;

  try {
    await client.messages.create({
      body: `New Order! Total: ₹${order.total}`,
      from: "whatsapp:+14155238886",
      to: "whatsapp:+91YOURNUMBER"
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "WhatsApp failed" });
  }
}
