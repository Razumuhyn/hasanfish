import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import animation from "../../assets/LoginAnimation/loginAnimation.json";
import LottieView from "lottie-react-native";
import { auth } from "../../firebase";

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Başarılı", "Giriş yapıldı!");
      navigation.navigate("MainTab");
    } catch (error) {
      Alert.alert("Hata", error.message);
    }
  };

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Kayıt Başarılı", "Hesabınız oluşturuldu!");
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
            HasanFish
          </Text>

          <LottieView
            autoPlay
            style={{ width: 200, height: 200 }}
            source={animation}
          />

          <TextInput
            placeholder="E-posta"
            className="w-full border border-gray-300 p-3 mb-4 rounded-lg mt-4"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Şifre"
            className="w-full border border-gray-300 p-3 mb-6 rounded-lg"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            onPress={handleLogin}
            className="bg-primeBlue w-full py-3 rounded-xl mb-3"
          >
            <Text className="text-white text-center font-semibold">
              Giriş Yap
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("register")}
            className="mt-4"
          >
            <Text className="text-sm text-primeBlue font-semibold">
              Hesabınız yok mu? Kayıt Ol
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginPage;
