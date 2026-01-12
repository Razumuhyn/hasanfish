import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

export async function placeOrder(cartItems) {
  if (!auth.currentUser) {
    throw new Error("Kullanıcı giriş yapmamış.");
  }

  if (cartItems.length === 0) {
    throw new Error("Sepet boş, sipariş verilemez.");
  }

  // Sipariş detayları hazırlanıyor
  const orderData = {
    userId: auth.currentUser.uid,
    userEmail: auth.currentUser.email,
    items: cartItems.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
    totalAmount: cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),
    createdAt: serverTimestamp(),
    status: "pending", // İstersen sipariş durumunu takip etmek için
  };

  try {
    const ordersCollection = collection(db, "orders");
    const docRef = await addDoc(ordersCollection, orderData);
    return docRef.id; // Sipariş ID döner
  } catch (error) {
    console.error("Sipariş oluşturulamadı: ", error);
    throw error;
  }
}
