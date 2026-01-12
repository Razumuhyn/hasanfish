import { View, Text, Image, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import animation from "../../assets/TutorialAnimations/secondTutorial.json";

const TutorialSecond = ({ navigation }) => {
  return (
    <View>
      <View className="bg-white h-full">
        <View className="imgAndTextArea h-[90%] flex items-center justify-center flex-col">
          <LottieView
            autoPlay
            style={{
              width: 300,
              height: 300,
            }}
            source={animation}
          />
          <Text
            style={{
              fontFamily: "pop-semibold",
            }}
            className="text-gray-700 font-semibold text-center text-[18px] mx-6"
          >
            HasanFish
          </Text>
          <Text
            style={{
              fontFamily: "pop-reg",
            }}
            className="text-gray-600 font-normal text-center text-base flex flex-wrap mt-5"
          >
            Balıkçılarla pazarcıları buluşturan dijital pazar yeriniz.
          </Text>
        </View>
        <View className="mx-5 mb-6 flex-row justify-between items-center gap-2">
          {/* Geri Butonu */}
          <TouchableOpacity
            className="bg-gray-200 px-4 py-3 rounded-xl w-[25%]"
            onPress={() => navigation.goBack()}
          >
            <Text
              style={{ fontFamily: "pop-reg" }}
              className="text-gray-600 text-base font-semibold text-center"
            >
              Geri
            </Text>
          </TouchableOpacity>

          {/* İleri Butonu */}
          <TouchableOpacity
            className="bg-primeBlue px-4 py-3 rounded-xl w-[75%]"
            onPress={() => navigation.navigate("TutorialThird")}
          >
            <Text
              style={{ fontFamily: "pop-reg" }}
              className="text-white text-base font-semibold text-center"
            >
              İleri
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TutorialSecond;
