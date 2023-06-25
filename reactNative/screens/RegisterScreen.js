import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import React, {useLayoutEffect, useState} from 'react'
import {Button, Input, Image, Avatar, Text} from '@rneui/base';
import { StatusBar } from "expo-status-bar"
import { updateProfile, getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const RegisterScreen = ({navigation}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [imageurl, setImageUrl] = useState("");
    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Login",
        });
    }, [navigation]);

    const register = () => {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                updateProfile(auth.currentUser, {
                    displayName: name,
                    photoURL: imageurl || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                })    
            }).catch(error => alert(error.message));
    };
    return (
        <KeyboardAvoidingView bahavior="padding" style={styles.container}>
            <StatusBar style="light"/>
            <Text h3 style={{marginBottom: 50}}>Register a new account</Text>

            <View style={styles.inputContainer}>
                <Input
                    placeholder="Full Name"
                    autofocus type="text"
                    value={name}
                    onChangeText ={text =>setName(text)}
                />
                <Input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChangeText ={text =>setEmail(text)}
                />
                <Input
                    placeholder="Password"
                    type="password"
                    secureTextEntry
                    value={password}
                    onChangeText ={text =>setPassword(text)}
                />
                <Input
                    placeholder="Profile Picture Url (optional)"
                    type="text"
                    value={imageurl}
                    onChangeText={text => setImageUrl(text)}
                    onSubmitEditing={register}
                />
            </View>
            <Button
                containerStyle = {styles.button}
                raised
                onPress={register}
                title="Register"
            />
            <View style={{height:100}}/>
            </KeyboardAvoidingView>  
    )
        
}
    
export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "white",
    },
    inputContainer: {
        width: 300,
    },
    button: {
        width: 200,
        marginTop:10,
    }
})