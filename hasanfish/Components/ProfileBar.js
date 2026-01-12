// components/TopBar.js
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import logo from "../assets/icon.png";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../context/CartContext"; // <-- Cart context

export default function TopBar({
  logoSource = logo,
  showCart = true,
  onLogoPress = null, // opsiyonel override
}) {
  const navigation = useNavigation();
  const { cartItems } = useCart();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View className="flex-row items-center justify-between px-4 py-2 bg-white shadow-sm">
      {/* Sol Logo */}
      <TouchableOpacity
        onPress={
          onLogoPress ? onLogoPress : () => navigation.navigate("Anasayfa")
        }
        className="flex-row items-center"
      >
        <Image source={logoSource} className="w-16 h-16" resizeMode="contain" />
      </TouchableOpacity>

      {/* Orta Başlık */}
      <Text className="text-xl font-semibold text-gray-900">HasanFish</Text>

      {/* Sağ Sepet */}
      {showCart ? (
        <TouchableOpacity
          onPress={() => navigation.navigate("Sepet")}
          className="relative"
        >
          <Ionicons name="cart-outline" size={28} color="#007AFF" />
          {cartCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-xs text-white font-bold">{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <View className="w-7 h-7" /> // boşluk korunsun
      )}
    </View>
  );
}
