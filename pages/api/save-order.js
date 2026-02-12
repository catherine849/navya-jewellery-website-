import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_SERVER_API_KEY,
  authDomain: process.env.FIREBASE_SERVER_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_SERVER_PROJECT_ID,
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const order = req.body;
    
    // Add timestamp and order ID
    const orderData = {
      ...order,
      createdAt: serverTimestamp(),
      orderId: `ORD-${Date.now()}`,
      status: "pending"
    };

    const docRef = await addDoc(collection(db, "orders"), orderData);
    
    res.status(200).json({ 
      message: "Order saved successfully",
      orderId: docRef.id 
    });
  } catch (err) {
    console.error("Firebase save error:", err);
    res.status(500).json({ error: "Database error" });
  }
}
