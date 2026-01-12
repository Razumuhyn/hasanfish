import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigation } from "@react-navigation/native";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../firebase";

const CartScreen = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();
  const navigation = useNavigation();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Sipariş verme fonksiyonu
  const handlePlaceOrder = async () => {
    if (!auth.currentUser) {
      Alert.alert("Hata", "Sipariş vermek için giriş yapmalısınız.");
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert("Uyarı", "Sepetiniz boş.");
      return;
    }

    const orderData = {
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email,
      items: cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      totalAmount: totalPrice,
      createdAt: serverTimestamp(),
      status: "pending",
    };

    try {
      const ordersCollection = collection(db, "orders");
      const docRef = await addDoc(ordersCollection, orderData);
      Alert.alert(
        "Sipariş Verildi",
        `Siparişiniz başarıyla oluşturuldu. Sipariş ID: ${docRef.id}`
      );
      clearCart();
      navigation.navigate("MainTab");
    } catch (error) {
      Alert.alert("Hata", "Sipariş verilirken bir sorun oluştu.");
      console.error("Sipariş hatası:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-4 ">
      <Text className="text-2xl font-bold mb-4 mx-4">Sepet</Text>

      {cartItems.length === 0 ? (
        <Text className="text-gray-500 text-center mt-10 mx-4">
          Sepetiniz boş
        </Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View className="flex-row items-center justify-between mb-4 bg-gray-50 p-2 rounded-lg mx-4">
              {/* Ürün Görseli */}
              <Image
                source={{ uri: item.image }}
                className="w-16 h-16 rounded-lg mr-3"
                resizeMode="cover"
              />

              {/* Ürün Bilgileri */}
              <View className="flex-1">
                <Text className="text-base font-semibold">{item.name}</Text>
                <Text className="text-sm text-gray-500">
                  {item.price}₺ x {item.quantity} = {item.price * item.quantity}
                  ₺
                </Text>
              </View>

              {/* Miktar Arttırma/Azaltma Butonları */}
              <View className="flex-row items-center space-x-2">
                <TouchableOpacity
                  className="bg-gray-300 px-2 py-1 rounded"
                  onPress={() => decreaseQuantity(item.name)}
                >
                  <Text className="text-lg font-bold">−</Text>
                </TouchableOpacity>

                <Text className="text-lg font-semibold mx-2">
                  {item.quantity}
                </Text>

                <TouchableOpacity
                  className="bg-gray-300 px-2 py-1 rounded"
                  onPress={() => increaseQuantity(item.name)}
                >
                  <Text className="text-lg font-bold">+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Toplam ve Butonlar */}
      {cartItems.length > 0 && (
        <View className="my-8 mx-4">
          <Text className="text-lg font-semibold mb-2">
            Toplam: {totalPrice} ₺
          </Text>

          <TouchableOpacity
            className="bg-green-600 py-3 rounded-xl items-center mb-4"
            onPress={handlePlaceOrder}
          >
            <Text className="text-white text-lg font-semibold">
              Sipariş Ver
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-blue-600 py-3 rounded-xl items-center"
            onPress={clearCart}
          >
            <Text className="text-white text-lg">Sepeti Temizle</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;
