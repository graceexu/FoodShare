import { StatusBar } from 'expo-status-bar';
import "react-native-gesture-handler"
import { StyleSheet, Text, View } from 'react-native';
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from "./screens/LoginScreen.js"
import RegisterScreen from "./screens/RegisterScreen.js"
import HomeScreen from './screens/HomeScreen.js';
import AddFoodItem from './screens/AddFoodItem.js';
import ProfileScreen from './screens/profileScreen.js';

const Stack = createStackNavigator();
const globalScreenOptions = {
  headerStyle: { backgroundColor: "#2C6BED" },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
}
export default function App() {

  return (

    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Register' component={RegisterScreen} />
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name="AddFoodItem" component={AddFoodItem} />
        <Stack.Screen name= "Profile" component = {ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});