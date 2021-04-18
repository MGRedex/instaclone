import React, { Component } from 'react';
import { View, Button, TextInput, Text } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';
import { RegLogTextInput, SignButton } from '../../Styles';
export default class RegisterScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            email:'',
            password:'',
            name: '',
        }

        this.onSignUp = this.onSignUp.bind(this)
    }
    onSignUp(){
        const { email, password, name } = this.state
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((result) => {
            firebase.firestore().collection("users")
            .doc(firebase.auth().currentUser.uid)
            .set({
                name,
                email
            })
            console.log(result)
        })
        .catch((error) => {
            console.log(error)
        })
    }
    render(){
        return (
            <View style={{flex:1, justifyContent: "center"}}>
                <RegLogTextInput 
                    placeholder="name" 
                    onChangeText={(name) => this.setState({ name })}/>
                <RegLogTextInput 
                    placeholder="email" 
                    onChangeText={(email) => this.setState({ email })}/>
                <RegLogTextInput 
                    placeholder="password"
                    secureTextEntry={true} 
                    onChangeText={(password) => this.setState({ password })}/>
                <View style={{justifyContent: "center", height:"5%", alignItems: "center"}}>
                    <SignButton style={{height:"100%"}} onPress={() => this.onSignUp()}>
                        <Text style={{color: 'white'}}>Sign up</Text>
                    </SignButton>
                </View>
            </View>
        )
    }
}