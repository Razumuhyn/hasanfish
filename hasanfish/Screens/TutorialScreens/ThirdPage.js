import { View, Text, Image, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import animation from "../../assets/TutorialAnimations/thirdTutorial.json";

const TutorialThird = ({ navigation }) => {
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
            Artık aracı yok, zaman kaybı yok! Sadece tut, listele ve sat!
          </Text>
          <Text
            style={{
              fontFamily: "pop-reg",
            }}
            className="text-gray-600 font-normal text-center text-base flex flex-wrap mt-5"
          >
            HasanFish, balıkçıların tuttukları taze balıkları doğrudan
            pazarcılara kolayca satabilecekleri bir mobil uygulamadır.
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
            onPress={() => navigation.navigate("login")}
          >
            <Text
              style={{ fontFamily: "pop-reg" }}
              className="text-white text-base font-semibold text-center"
            >
              Başla
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TutorialThird;
