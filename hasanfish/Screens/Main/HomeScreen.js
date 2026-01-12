import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase"; // firebase config dosyanın yolu

import ProductBox from "../../Components/ProductBox";
import TopBar from "../../Components/ProfileBar";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const cartItems = 3;
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fishList, setFishList] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  let isMounted = true;

  async function fetchFishList() {
    try {
      const fishCollection = collection(db, "fishlist");
      const q = query(fishCollection, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      if (isMounted) {
        const fishes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFishList(fishes);
      }
    } catch (error) {
      if (isMounted) setFishList([]);
    } finally {
      if (isMounted) setLoading(false);
    }
  }

  fetchFishList();

  return () => {
    isMounted = false;
  };
}, []);


  useEffect(() => {
    const intervalId = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= fishList.length) nextIndex = 0;

      setCurrentIndex(nextIndex);

      scrollRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentIndex, fishList]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#00f" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 py-6 ">
      <TopBar
        cartCount={cartItems}
        onCartPress={() => navigation.navigate("Sepet")}
        onProfilePress={() => navigation.navigate("Ayarlar")}
      />

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      >
        {fishList.map((fish) => (
          <View
            key={fish.id}
            style={{
              width: width,
              overflow: "hidden",
            }}
          >
            <Image
              source={{ uri: fish.image }}
              style={{ width: "100%", height: 250 }}
              resizeMode="cover"
            />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                paddingVertical: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                {fish.name}
              </Text>
              <Text style={{ color: "white", fontSize: 16 }}>
                {fish.price} TL
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <Text className="text-base text-gray-600 text-center font-semibold mt-2">
        Son Eklenen Balıklar
      </Text>

      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {fishList.map((fish) => (
          <ProductBox key={fish.id} product={fish} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
