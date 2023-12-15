import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, ScrollView, View, SafeAreaView } from "react-native";
import { DeviceMotion, type DeviceMotionMeasurement } from "expo-sensors";
import { type Subscription } from "expo-sensors/build/Pedometer";

const TILT_THRESHOLD = 0.5;
const generateRandomColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor}`;
};
export default function App() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    DeviceMotion.setUpdateInterval(1000);
    const subscribe = () => {
      setSubscription(
        DeviceMotion.addListener((motionData) => {
          handleMotion(motionData);
        })
      );
    };
    const unsubscribe = () => {
      subscription && subscription.remove();
      setSubscription(null);
    };
    subscribe();
    return () => unsubscribe();
  }, []);

  const handleMotion = (motionData: DeviceMotionMeasurement) => {
    const { rotation } = motionData;

    if (rotation.beta > TILT_THRESHOLD) {
      //Possibly find a way to slow down the scroll speed
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      console.log("scroll up");
    } else if (rotation.beta < -TILT_THRESHOLD) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
      console.log("scroll down");
    } else {
      //Should stop scrolling at current position
      console.log("no scroll");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          textAlign: "center",
          marginTop: 20,
        }}
      >
        Gravity Scroll
      </Text>

      <ScrollView ref={scrollViewRef} style={{ flex: 1 }}>
        {Array.from({ length: 10000 }).map((_, index) => {
          return (
            <View
              key={index}
              style={{
                height: 100,
                width: "100%",
                backgroundColor: generateRandomColor(),
                justifyContent: "center",
              }}
            >
              <Text style={styles.text}>{index}</Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
