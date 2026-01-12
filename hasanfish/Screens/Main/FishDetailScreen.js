import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import React from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useCart } from "../../context/CartContext";

export default function FishDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { product } = route.params;

  const { addToCart } = useCart();

  const getFormattedDate = (createdAt) => {
    if (!createdAt?.seconds) return "Bilinmiyor";
    const date = new Date(createdAt.seconds * 1000);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleAddToCart = () => {
    addToCart(product);
    Alert.alert("Sepete Eklendi", `${product.name} sepete eklendi.`, [
      {
        text: "Tamam",
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Geri Butonu */}
      <View className="flex-row items-center px-4 pt-4">
        <TouchableOpacity onPress={() => navigation.navigate("MainTab")}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-4 pt-2 mb-24">
        <Image
          source={{ uri: product.image }}
          className="w-full h-64 rounded-xl mb-4"
          resizeMode="cover"
        />

        <Text className="text-2xl font-bold text-gray-800 mb-1">
          {product.name}
        </Text>

        <Text className="text-sm text-gray-500 mb-1">
          Kategori: {product.category}
        </Text>

        <Text className="text-sm text-gray-500 mb-1">
          Eklenme: {getFormattedDate(product.createdAt)}
        </Text>

        <Text className="text-sm text-gray-500 mb-4">Satıcı: Bilinmiyor</Text>

        <Text className="text-xl text-green-600 font-semibold mb-2">
          {product.price} ₺
        </Text>

        <Text className="text-base text-gray-700 mb-6 leading-relaxed">
          {product.detail}
        </Text>
      </ScrollView>

      {/* Sepete Ekle Butonu */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-4 py-3 border-t border-gray-200 mb-8">
        <TouchableOpacity
          className="bg-blue-600 py-4 rounded-xl items-center"
          onPress={handleAddToCart}
        >
          <Text className="text-white text-lg font-semibold">Sepete Ekle</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
