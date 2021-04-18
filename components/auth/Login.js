import React, { Component } from 'react';
import { View, Button, TextInput,Text } from 'react-native';
import firebase from 'firebase';
import { RegLogTextInput, SignButton } from '../../Styles';
export class LoginScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            email:'',
            password:'',
        }

        this.onSignUp = this.onSignUp.bind(this)
    }
    onSignUp(){
        const { email, password } = this.state
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
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
                    placeholder="email" 
                    onChangeText={(email) => this.setState({ email })}/>
                <RegLogTextInput 
                    placeholder="password"
                    secureTextEntry={true} 
                    onChangeText={(password) => this.setState({ password })}/>
                <View style={{justifyContent: "center", height:"5%", alignItems: "center"}}>
                    <SignButton style={{height:"100%"}} onPress={() => this.onSignUp()}>
                        <Text style={{color: 'white'}}>Sign in</Text>
                    </SignButton>
                </View>
            </View>
        )
    }
}

export default LoginScreen