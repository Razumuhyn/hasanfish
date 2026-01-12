import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import TopBar from "../../Components/ProfileBar";
import ProductBox from "../../Components/ProductBox";

const { width } = Dimensions.get("window");
const ITEMS_PER_PAGE = 4;

export default function MarketScreen({ navigation }) {
  const cartItems = 3;
  const scrollRefs = useRef({});
  const [fishData, setFishData] = useState({});
  const [activePageByCategory, setActivePageByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFishData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "fishlist"));
        const data = {};

        querySnapshot.forEach((doc) => {
          const fish = doc.data();
          const category = fish.category || "Diğer";
          if (!data[category]) {
            data[category] = [];
          }

          data[category].push({
            id: doc.id,
            name: fish.name,
            price: fish.price,
            image: fish.image,
          });
        });

        setFishData(data);

        // Her kategori için ilk sayfayı başlat
        const pageState = Object.fromEntries(
          Object.keys(data).map((cat) => [cat, 0])
        );
        setActivePageByCategory(pageState);
      } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error);
      }
      setLoading(false);
    };

    fetchFishData();
  }, []);

  const getPageCount = (arr) => Math.ceil(arr.length / ITEMS_PER_PAGE);

  const onScroll = (category, event) => {
    const x = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(x / width);
    setActivePageByCategory((prev) => ({ ...prev, [category]: pageIndex }));
  };

  const scrollToPage = (category, pageIndex) => {
    scrollRefs.current[category]?.scrollTo({
      x: pageIndex * width,
      animated: true,
    });
    setActivePageByCategory((prev) => ({ ...prev, [category]: pageIndex }));
  };

  const getPageItems = (items, pageIndex) => {
    const start = pageIndex * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#1E40AF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <TopBar
        cartCount={cartItems}
        onCartPress={() => navigation.navigate("CartScreen")}
        onProfilePress={() => navigation.navigate("AccountScreen")}
      />

      <ScrollView contentContainerStyle={{ padding: 4 }}>
        {Object.entries(fishData).map(([category, fishes]) => {
          const pageCount = getPageCount(fishes);
          const activePage = activePageByCategory[category] || 0;

          return (
            <View key={category} className="mb-4">
              <Text className="text-xl font-semibold m-4 text-gray-600">
                {category}
              </Text>

              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => onScroll(category, e)}
                scrollEventThrottle={16}
                ref={(ref) => (scrollRefs.current[category] = ref)}
              >
                {[...Array(pageCount)].map((_, pageIndex) => {
                  const pageItems = getPageItems(fishes, pageIndex);
                  return (
                    <View
                      key={pageIndex}
                      style={{ width }}
                      className="flex-row flex-wrap justify-between"
                    >
                      {pageItems.map((fish) => (
                        <View
                          key={fish.id}
                          style={{
                            width: "50%",
                            marginBottom: 4,
                          }}
                        >
                          <ProductBox product={fish} />
                        </View>
                      ))}
                    </View>
                  );
                })}
              </ScrollView>

              <View className="flex-row justify-center mt-2">
                {[...Array(pageCount)].map((_, dotIndex) => (
                  <TouchableOpacity
                    key={dotIndex}
                    onPress={() => scrollToPage(category, dotIndex)}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 5,
                      marginHorizontal: 4,
                      backgroundColor:
                        dotIndex === activePage ? "#1E40AF" : "#CBD5E1",
                    }}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
