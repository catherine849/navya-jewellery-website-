import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  try {
    const order = req.body;
    await addDoc(collection(db, "orders"), order);
    res.status(200).json({ message: "Order saved" });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
}
