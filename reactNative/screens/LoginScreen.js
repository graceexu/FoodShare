import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Image } from '@rneui/base';
import { StatusBar } from 'expo-status-bar';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FlashMessage, { showMessage } from 'react-native-flash-message';

import '../firebase';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const flashMessageRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.navigate('Home');
      }
    });

    return unsubscribe;
  }, []);

  const signIn = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigation.navigate('Home');
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        showMessage({
          message: 'Login Failed',
          description: 'Invalid email or password',
          type: 'danger',
          statusBarHeight: 10,
          titleStyle: { fontSize: 16 },
          textStyle: { fontSize: 14 },
          duration: 2500,
          hideOnPress: true,
        });
      });
  };

  const clearInputs = () => {
    setEmail('');
    setPassword('');
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={{
          uri:
            'https://lh3.googleusercontent.com/NF1SXS6mFUtB6UTH2n_FBG6BIAnysuIzwWtjOSr1MH1UU5BkiGCTSOCersLxULRBxakuhtFchQxUAfuTO8SOh0NEzya4eAtYyiM6QVs',
        }}
        style={{ width: 150, height: 150 }}
      />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          autoFocus
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          secureTextEntry={!showPassword}
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          rightIcon={
            <Button
              type="clear"
              icon={
                <Icon
                  name={showPassword ? 'eye-slash' : 'eye'}
                  size={18}
                  color={showPassword ? 'grey' : 'black'}
                />
              }
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />
      </View>
      <Button
        containerStyle={styles.button}
        onPress={() => {
          signIn();
          clearInputs();
        }}
        title="Login"
      />
      <Button
        onPress={() => {
          navigation.navigate('Register');
        }}
        containerStyle={styles.button}
        type="outline"
        title="Register"
      />
      <View style={{ height: 100 }} />
      <FlashMessage ref={flashMessageRef} position="top" />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});