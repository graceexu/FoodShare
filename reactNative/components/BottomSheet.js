import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

const BottomSheet = ({ onHomePress, onAddFoodPress, onProfilePress }) => {
  return (
    <View style={styles.bottomSheet}>
      <TouchableOpacity style={styles.bottomSheetIcon} onPress={onHomePress}>
        <Feather name="home" size={28} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.addFoodIcon} onPress={onAddFoodPress}>
        <Feather name="plus-circle" size={44} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.bottomSheetIcon} onPress={onProfilePress}>
        <Feather name="user" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: "#2C6BED",
  },
  bottomSheetIcon: {
    alignItems: "center",
  },
  addFoodIcon: {
    alignItems: "center",
  },
});

export default BottomSheet;