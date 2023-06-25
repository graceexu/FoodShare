import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Feather } from "@expo/vector-icons";

const FoodItem = ({ imageSource, Title, Description, Location, User }) => {

  const handleMapClick = () => {
    const address = encodeURIComponent(Location);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${address}`);
  };

  return (
    <TouchableOpacity style={styles.foodCard}>
      <Image source={{ uri: imageSource }} style={styles.foodImage} resizeMode="cover" />
      <View style={styles.foodDetails}>
        <Text style={styles.foodTitle}>{Title}</Text>
        <Text style={styles.foodDescription}>{Description}</Text>
        <TouchableOpacity style={styles.locationContainer} onPress={handleMapClick}>
          <Feather name="map-pin" size={18} color="#666" style={styles.mapIcon} />
          <Text style={styles.foodLocation}>{Location}</Text>
        </TouchableOpacity>
        <Text style={styles.postedBy}>Posted by: {User}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  foodCard: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  foodDetails: {
    flex: 1,
  },
  foodTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  foodDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mapIcon: {
    marginRight: 4,
  },
  foodLocation: {
    fontSize: 12,
    color: "#999",
  },
  postedBy: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",    
  },
});

export default FoodItem;