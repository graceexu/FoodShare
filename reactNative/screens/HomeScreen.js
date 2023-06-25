import React, { useLayoutEffect, useState, useEffect } from "react";
import { Text, View, SafeAreaView, StyleSheet, ScrollView, Image, TextInput } from "react-native";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import FoodItem from "../components/FoodItem";
import BottomSheet from "../components/BottomSheet";
import { Feather } from "@expo/vector-icons";


const HomeScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: null,
    });
  }, [navigation]);

  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useLayoutEffect(() => {
    const db = getFirestore();
    const ref = collection(db, "categories");
    onSnapshot(ref, (categories) => {
      setData(categories.docs.map((category) => ({
        id: category.id,
        data: category.data()
      })));
    });
  }, []);

  useEffect(() => {
    const filteredListings = data.filter((item) =>
      item.data.Title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filteredListings);
  }, [data, searchText]);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleAddFoodItem = () => {
    navigation.navigate("AddFoodItem");
  };

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchText}
          onChangeText={handleSearch}
        />
        <Feather name="search" size={24} color="#999" style={styles.searchIcon} />
      </View>
      <ScrollView style={styles.scrollContainer}>
        {filteredData.map((item, key) => (
          <View key={key}>
            <FoodItem
              imageSource={item.data.Image}
              Title={item.data.Title}
              Description={item.data.Description}
              Location={item.data.Location}
              User = {item.data.User}
            />
          </View>
        ))}
      </ScrollView>
      <BottomSheet
        onHomePress={() => navigation.navigate("Home")}
        onAddFoodPress={() => navigation.navigate("AddFoodItem")}
        onProfilePress={() => navigation.navigate("Profile")}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
    marginTop: -6,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  searchIcon: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
});
export default HomeScreen;