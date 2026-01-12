import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ProductBox({ product }) {
  const { width } = Dimensions.get("window");
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      className="bg-white p-1 rounded-xl mx-2 mb-4"
      style={{ width: width * 0.40 }}
      onPress={() => navigation.navigate("FishDetail", { product })}
    >
      <Image
        source={{ uri: product.image }}
        className="w-full h-24 rounded-md mb-2"
        resizeMode="cover"
      />
      <Text className="text-base font-semibold text-gray-800">
        {product.name}
      </Text>
      <Text className="text-sm text-green-600">{product.price} ₺</Text>
    </TouchableOpacity>
  );
}
