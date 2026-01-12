import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import animation from "../../assets/LoginAnimation/registerAnimation.json";
import LottieView from "lottie-react-native";
import { auth } from "../../firebase";

const RegisterPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler eşleşmiyor.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Başarılı", "Kayıt oldunuz!");
      navigation.navigate("login");
    } catch (error) {
      Alert.alert("Hata", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center items-center px-6 py-10">
          <Text className="text-2xl font-bold text-gray-800 mb-6">
            Kayıt Ol
          </Text>

          <LottieView
            autoPlay
            style={{ width: 200, height: 200 }}
            source={animation}
          />

          <TextInput
            placeholder="E-posta"
            className="w-full border border-gray-300 p-3 mb-4 rounded-lg"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Şifre"
            className="w-full border border-gray-300 p-3 mb-4 rounded-lg"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            placeholder="Şifre Tekrar"
            className="w-full border border-gray-300 p-3 mb-6 rounded-lg"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            onPress={handleRegister}
            className="bg-primeBlue w-full py-3 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">
              Kayıt Ol
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("login")}
            className="mt-4"
          >
            <Text className="text-sm text-primeBlue font-semibold">
              Zaten hesabınız var mı? Giriş Yap
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterPage;
