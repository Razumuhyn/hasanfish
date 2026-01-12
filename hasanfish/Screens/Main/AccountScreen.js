import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { db, auth } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function AccountScreen() {
  const [activeTab, setActiveTab] = useState("products"); // "products" veya "orders"
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const userId = auth.currentUser?.uid;
  const navigation = useNavigation();

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "products") {
          // Satıcının ürünlerini çek (fishlist koleksiyonu)
          const productsRef = collection(db, "fishlist");
          const q = query(productsRef, where("userId", "==", userId));
          const querySnapshot = await getDocs(q);
          const productsList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProducts(productsList);
        } else if (activeTab === "orders") {
          // Alıcının siparişlerini çek (orders koleksiyonu)
          const ordersRef = collection(db, "orders");
          const q = query(ordersRef, where("userId", "==", userId));
          const querySnapshot = await getDocs(q);
          const ordersList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOrders(ordersList);
        }
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [activeTab, userId]);

  // Çıkış butonu fonksiyonu
  const handleSignOut = () => {
    Alert.alert("Çıkış Yap", "Hesabınızdan çıkmak istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Çıkış Yap",
        style: "destructive",
        onPress: async () => {
          try {
            await auth.signOut();
            navigation.navigate("login"); // Giriş ekranına yönlendir
          } catch (error) {
            Alert.alert("Hata", "Çıkış yaparken bir hata oluştu.");
          }
        },
      },
    ]);
  };

  // Ürünleri listele
  const renderProduct = ({ item }) => (
    <View className="flex-row items-center bg-gray-50 p-3 rounded-lg mb-3 mx-4">
      <Image
        source={{ uri: item.image }}
        className="w-16 h-16 rounded-lg mr-4"
        resizeMode="cover"
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold">{item.name}</Text>
        <Text className="text-green-600 font-bold">{item.price} ₺</Text>
        <Text className="text-gray-500">Kategori: {item.category}</Text>
      </View>
    </View>
  );

  // Siparişleri listele
  const renderOrder = ({ item }) => (
    <View className="bg-gray-100 p-4 rounded-lg mb-4 mx-4">
      <Text className="font-semibold text-lg mb-2">Sipariş ID: {item.id}</Text>
      <Text className="mb-1">Toplam Tutar: {item.totalAmount} ₺</Text>
      <Text className="mb-2">Durum: {item.status}</Text>

      <Text className="font-semibold mb-1">Ürünler:</Text>
      {item.items?.map((product, index) => (
        <View key={index} className="flex-row items-center mb-1">
          <Image
            source={{ uri: product.image }}
            className="w-10 h-10 rounded mr-3"
            resizeMode="cover"
          />
          <Text>
            {product.name} x{product.quantity} - {product.price}₺
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* TopBar */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-300">
        <Text className="text-xl font-bold">👤 Hesabım</Text>
        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-red-600 px-3 py-1 rounded"
        >
          <Text className="text-white font-semibold">Çıkış Yap</Text>
        </TouchableOpacity>
      </View>

      {/* Tablar */}
      <View className="flex-row justify-around border-b border-gray-300 py-4">
        <TouchableOpacity onPress={() => setActiveTab("products")}>
          <Text
            className={`text-lg font-semibold ${
              activeTab === "products" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            Ürünlerim
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("orders")}>
          <Text
            className={`text-lg font-semibold ${
              activeTab === "orders" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            Siparişlerim
          </Text>
        </TouchableOpacity>
      </View>

      {/* İçerik */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : activeTab === "products" ? (
        products.length === 0 ? (
          <Text className="text-center mt-10 text-gray-500">
            Ürününüz bulunmamaktadır.
          </Text>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={renderProduct}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        )
      ) : orders.length === 0 ? (
        <Text className="text-center mt-10 text-gray-500">
          Siparişiniz bulunmamaktadır.
        </Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}
    </SafeAreaView>
  );
}
