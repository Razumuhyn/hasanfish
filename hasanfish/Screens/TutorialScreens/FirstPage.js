import { View, Text, Image, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import animation from "../../assets/TutorialAnimations/firstTutorial.json";

const TutorialFirst = ({ navigation }) => {
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
            HasanFish'e Hoş Geldiniz!
          </Text>
        </View>
        <View className="buttonArea mx-5  flex justify-end">
          <TouchableOpacity
            className="bg-primeBlue p-3 rounded-xl"
            onPress={() => navigation.navigate("TutorialSecond")}
          >
            <Text
              style={{
                fontFamily: "pop-reg",
              }}
              className=" text-white text-lg text-center font-semibold"
            >
              İleri
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TutorialFirst;
