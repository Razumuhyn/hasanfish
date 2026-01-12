import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  Platform,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage, auth } from "../../firebase";
import TopBar from "../../Components/ProfileBar";
import { Picker } from "@react-native-picker/picker";
import * as FileSystem from "expo-file-system";

const categories = [
  "Deniz Balıkları",
  "Tatlı Su Balıkları",
  "Kabuklular",
  "Kabuklu Deniz Ürünleri",
  "Sütun Balıkları",
  "Yumuşakçalar",
  "Diğer",
];

export default function SellScreen({ navigation }) {
  const cartItems = 3;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [detail, setDetail] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("");
  const [isPickerVisible, setPickerVisible] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

const handleSubmit = async () => {
  if (!name || !price || !image || !detail || !category) {
    Alert.alert("Hata", "Lütfen tüm alanları doldurun ve kategori seçin.");
    return;
  }

  setUploading(true);

  try {
    // 1️⃣ Resmi uri olarak alıyoruz
    const response = await fetch(image); // image URI (local)
    const blob = await response.blob(); // direkt blob oluşturuyoruz

    // 2️⃣ Firebase Storage referansı
    const filename = `fishlist/${Date.now()}.jpg`;
    const imageRef = ref(storage, filename);

    // 3️⃣ Yükleme
    await uploadBytes(imageRef, blob);
    const downloadURL = await getDownloadURL(imageRef);

    // 4️⃣ Firestore kaydı
    await addDoc(collection(db, "fishlist"), {
      name,
      price: parseFloat(price),
      detail,
      image: downloadURL,
      category,
      userId: auth.currentUser?.uid || null,
      createdAt: serverTimestamp(),
    });

    Alert.alert("Başarılı", "Balık başarıyla eklendi!");
    setName("");
    setPrice("");
    setImage(null);
    setCategory("");
  } catch (err) {
    console.error("Yükleme hatası:", err);
    Alert.alert("Hata", "Yükleme sırasında bir hata oluştu.");
  }

  setUploading(false);
};


  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <TopBar
        cartCount={cartItems}
        onCartPress={() => navigation.navigate("CartScreen")}
        onProfilePress={() => navigation.navigate("AccountScreen")}
      />
      <ScrollView className="px-5 pt-10">
        <Text className="text-xl font-semibold text-gray-600 text-center mb-6">
          Balık Satışı Ekle
        </Text>

        <View className="mb-4">
          <Text className="text-base font-semibold mb-2">Balık Adı</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Örn: Levrek"
            className="border border-gray-300 rounded-xl p-3 text-base"
          />
        </View>

        <View className="mb-4">
          <Text className="text-base font-semibold mb-2">Fiyat (TL)</Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholder="Örn: 150"
            className="border border-gray-300 rounded-xl p-3 text-base"
          />
        </View>

        {/* Kategori Seçimi */}
        <View className="mb-4">
          <Text className="text-base font-semibold mb-2">Kategori</Text>
          <TouchableOpacity
            onPress={() => setPickerVisible(true)}
            className="bg-gray-100 py-3 rounded-xl mb-2"
          >
            <Text className="text-center font-semibold text-base">
              {category ? category : "Kategori Seçiniz..."}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal Picker (iOS + Android) */}
        <Modal
          visible={isPickerVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setPickerVisible(false)}
        >
          <View
            className="flex-1 justify-end bg-opacity-30"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <View className="bg-white rounded-t-2xl p-4">
              <Text className="text-center font-bold text-lg mb-2">
                Kategori Seç
              </Text>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => {
                  setCategory(itemValue);
                  setPickerVisible(false);
                }}
              >
                <Picker.Item label="Seçiniz..." value="" />
                {categories.map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
              <TouchableOpacity
                onPress={() => setPickerVisible(false)}
                className="mb-8 bg-gray-300 p-3 rounded-xl"
              >
                <Text className="text-center">İptal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View className="mb-4">
          <Text className="text-base font-semibold mb-2">Detaylar</Text>
          <TextInput
            value={detail}
            onChangeText={setDetail}
            placeholder="Balık hakkında açıklama girin..."
            className="border border-gray-300 rounded-xl p-3 text-base"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          onPress={pickImage}
          className="bg-gray-200 py-3 rounded-xl mb-4"
        >
          <Text className="text-center font-semibold text-base">
            {image ? "Resmi Değiştir" : "Resim Seç"}
          </Text>
        </TouchableOpacity>

        {image && (
          <Image
            source={{ uri: image }}
            className="w-full h-48 rounded-xl mb-4"
            resizeMode="cover"
          />
        )}

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={uploading}
          className="bg-blue-500 py-3 rounded-xl"
        >
          {uploading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Satışa Ekle
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
