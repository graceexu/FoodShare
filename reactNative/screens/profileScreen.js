import React, { useLayoutEffect } from "react";
import { SafeAreaView, StyleSheet, Text, Image, TouchableOpacity, View } from "react-native";
import BottomSheet from "../components/BottomSheet";
import { getAuth, signOut } from "firebase/auth";

const ProfileScreen = ({ navigation }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user !== null) {
  // The user object has basic properties such as display name, email, etc.
    var displayName = user.displayName;
    var email = user.email;
    var photoURL = user.photoURL;
}
  console.log(displayName)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: null,
    });
  }, [navigation]);

  const handleLogout = () => {
    signOut(auth)
    .then(() => {
        navigation.navigate("Login")
    })
    .catch((error) => {
        console.log(error);
    });
    
  };

  const handleMessage = () => {
    // Implement your message functionality here
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <Image
          source={{ uri: photoURL }}
          style={styles.profileImage}
        />
      <Text style={styles.text}>{displayName}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleMessage}>
          <Text style={styles.buttonText}>Message</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 32,
  },
  topContainer: {
    marginTop: 60,
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  button: {
    backgroundColor: "#2C6BED",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;