import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native';
import React, {useState} from 'react'
import {Button, Input, Image, Avatar} from '@rneui/base';
import {StatusBar} from "expo-status-bar"
const LoginScreen = ({navigation}) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const signIn = () => {
        
    }
    return (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <StatusBar style = "light" />
            <Image source={{ uri: "https://lh3.googleusercontent.com/NF1SXS6mFUtB6UTH2n_FBG6BIAnysuIzwWtjOSr1MH1UU5BkiGCTSOCersLxULRBxakuhtFchQxUAfuTO8SOh0NEzya4eAtYyiM6QVs" }} style={{ width: 150, height: 150 }} />
            <View style={styles.inputContainer}>
                <Input
                    placeholder='Email'
                    autoFocus type="email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <Input
                    placeholder='Password'
                    secureTextEntry type="password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
            </View >
            <Button
                containerStyle={styles.button}
                onPress={signIn}
                title="Login" />
            <Button
                onPress={() => {
                    navigation.navigate("Register")
                }}
                containerStyle={styles.button}
                type="outline"
                title="Register" />
            <View style={{height:100}}/>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        backgroundColor: "white",
    },
    inputContainer: {
        width:300,
    },
    button: {
        width: 200,
        marginTop:10,
    },
})