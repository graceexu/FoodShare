import React, { useLayoutEffect, useState } from "react";
import { View, Text, Button, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Permissions } from 'expo';
import BottomSheet from "../components/BottomSheet";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {launchCameraAsync, useCameraPermissions, PermissionStatus} from 'expo-image-picker'
import * as ImagePicker from 'expo-image-picker';
import { getAuth, signOut } from "firebase/auth";


const AddFoodItem = ({ onAddFoodItem, navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: null,
    });
  }, [navigation]);
  const auth = getAuth();
  const user = auth.currentUser;
  if (user !== null) {
  // The user object has basic properties such as display name, email, etc.
    var displayName = user.displayName;
    var email = user.email;
    var photoURL = user.photoURL;
  }
  const [cameraPermissionInformation, requestPermission]=useCameraPermissions();
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
//   const [imageURL, setImageURL] = useState(null);  
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [uploading, setUploading] = useState(false)
  async function verifyPermission(){
    if (cameraPermissionInformation.status===PermissionStatus.UNDETERMINED){
        const permissionResponse=await requestPermission();

        return permissionResponse.granted;
    }
    if (cameraPermissionInformation.status===PermissionStatus.DENIED){
        Alert.alert(
            'Insufficient permission!',
            'You need to grant camera access to use this app'
        );
        return false
    }
    return true;
  }

  async function cameraPressHandler(){
    const hasPermission=await verifyPermission()
    if (!hasPermission){
        return;
    }
    const image=await launchCameraAsync({
        allowsEditing:true,
        aspect:[16,9],
        quality:0.5
    });
    setImage(image.assets) 
  }
  
    
async function uploadImageAsync() {
  if (!image) {
    return null;
  }

  const storage = getStorage();
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', image[0].uri || image);
    xhr.send(null);
  });

  const metadata = {
    contentType: 'image/jpeg',
  };

  const storageRef = ref(storage, 'categories/' + Date.now());
  const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

  try {
    await uploadTask;
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}
  
    
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

    
  const handleAddItem = async () => {
    const db = getFirestore();
    // const imageURL = uploadImageAsync(image);
      try {
        const imageURL = await uploadImageAsync();
        const docRef = await addDoc(collection(db, "categories"), {
            Title: title,
            Description: description,
            Location: location,
            Image: String(imageURL),
            User: displayName,
        });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    // Reset the form
    setImage(null);
    setTitle("");
    setDescription("");
    setLocation("");
  };

  let imagePreview = <Text style={styles.previewText}>No image taken yet</Text>

  if (image) {
    imagePreview = <Image source={{ uri: image[0].uri || image }} style={styles.imageStyle} />
  }

  return (
    <View style={styles.container}>
      <View style={styles.imagePreviewContainer}>
        {imagePreview}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={cameraPressHandler}>
          <Text style={styles.buttonText}>Take Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.descriptionContainer}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>
      <BottomSheet
        onHomePress={() => navigation.navigate("Home")}
        onAddFoodPress={() => navigation.navigate("AddFoodItem")}
        onProfilePress={() => navigation.navigate("Profile")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
    buttonContainer: {
    marginTop:25,
    flexDirection: "row",
    marginBottom: 25,
  },
  button: {
    flex: 1,
    backgroundColor: "rgb(32, 137, 220)",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginHorizontal: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  imagePreviewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 160,
    backgroundColor: '#f0cced',
    marginTop:-150,
    borderRadius: 8,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    resizeMode: "cover",
    borderRadius: 8,
  },
  input: {
    width: "100%",
    height: 40,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  descriptionContainer: {
    width: "100%",
    height: 120,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    textAlignVertical: 'center',
    paddingTop: 10
  },
  addButton: {
    backgroundColor: "rgb(32, 137, 220)",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16, // Add margin to separate the button from the text inputs
  },
  previewText: {
    color: '#592454',
  },
});

export default AddFoodItem;