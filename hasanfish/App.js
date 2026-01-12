import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // ✅ Expo Vector Icons
import { onAuthStateChanged } from "firebase/auth";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform, View, Text, TouchableOpacity } from "react-native";

import { auth } from "./firebase";
import { CartProvider, useCart } from "./context/CartContext";

// Screens
import TutorialFirst from "./Screens/TutorialScreens/FirstPage";
import TutorialSecond from "./Screens/TutorialScreens/SecondPage";
import TutorialThird from "./Screens/TutorialScreens/ThirdPage";
import RegisterPage from "./Screens/Login/RegisterPage";
import LoginPage from "./Screens/Login/LoginPage";
import HomeScreen from "./Screens/Main/HomeScreen";
import MarketScreen from "./Screens/Main/MarketScreen";
import AccountScreen from "./Screens/Main/AccountScreen";
import CartScreen from "./Screens/Main/CartScreen";
import SellScreen from "./Screens/Main/SellScreen";
import FishDetailScreen from "./Screens/Main/FishDetailScreen";

import "./global.css";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 🌟 Custom Tab Button (Satış butonu)
function CustomTabBarButton({ children, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ top: -20, justifyContent: "center", alignItems: "center" }}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#3B82F6",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
}

// ✅ Main Tab Navigator
function MainTabsWithCart() {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: Platform.OS === "android" ? 25 : 20,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case "Anasayfa":
              iconName = "home-outline";
              break;
            case "Pazar":
              iconName = "list-outline"; // fish-outline yok, list-outline kullandık
              break;
            case "Sepet":
              iconName = "cart-outline";
              break;
            case "Hesabım":
              iconName = "person-outline";
              break;
            case "Satış":
              iconName = "add";
              break;
          }

          if (route.name === "Sepet") {
            return (
              <View>
                <Ionicons name={iconName} size={size} color={color} />
                {cartCount > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -6,
                      backgroundColor: "red",
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
                      {cartCount}
                    </Text>
                  </View>
                )}
              </View>
            );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Anasayfa" component={HomeScreen} />
      <Tab.Screen name="Pazar" component={MarketScreen} />
      <Tab.Screen
        name="Satış"
        component={SellScreen}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="add" size={30} color="white" />,
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen name="Sepet" component={CartScreen} />
      <Tab.Screen name="Hesabım" component={AccountScreen} />
    </Tab.Navigator>
  );
}

// ✅ App
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 , marginBlock:23}}>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!user ? (
              <>
                <Stack.Screen name="TutorialFirst" component={TutorialFirst} />
                <Stack.Screen name="TutorialSecond" component={TutorialSecond} />
                <Stack.Screen name="TutorialThird" component={TutorialThird} />
                <Stack.Screen name="login" component={LoginPage} />
                <Stack.Screen name="register" component={RegisterPage} />
              </>
            ) : (
              <>
                <Stack.Screen name="MainTab" component={MainTabsWithCart} />
                <Stack.Screen name="FishDetail" component={FishDetailScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </GestureHandlerRootView>
  );
}
