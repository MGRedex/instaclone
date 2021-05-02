import React, { Component } from 'react';
import { View, Button, TextInput,Text } from 'react-native';
import firebase from 'firebase';
import { RegLogTextInput, SignButton } from '../../Styles';
import { connect } from 'react-redux';
import store from '../../redux/store/index'
import axios from 'axios'
export class LoginScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            login:'',
            password:'',
        }

        this.onSignIn = this.onSignIn.bind(this)
    }
    onSignIn(){
        const { login, password } = this.state
        axios.post('http://0.0.0.0:8000/api/rest-auth/login/', {
            username:login,
            email: 'test@gmail.com',
            password
        }).then((response) => {
            console.log(response)
            store.dispatch({type:"USER_AUTH_STATE_CHANGE", loggedIn: true})
        })
    }
    render(){
        return (
            <View style={{flex:1, justifyContent: "center"}}>
                <RegLogTextInput 
                    placeholder="login" 
                    onChangeText={(login) => this.setState({ login })}/>
                <RegLogTextInput 
                    placeholder="password"
                    secureTextEntry={true} 
                    onChangeText={(password) => this.setState({ password })}/>
                <View style={{justifyContent: "center", height:"5%", alignItems: "center"}}>
                    <SignButton style={{height:"100%"}} onPress={() => this.onSignIn()}>
                        <Text style={{color: 'white'}}>Sign in</Text>
                    </SignButton>
                </View>
            </View>
        )
    }
}
const mapStateToProps = (state) => ({
    loggedIn: state.userState.loggedIn,
})
export default connect(mapStateToProps)(LoginScreen)