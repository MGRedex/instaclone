import React, { Component } from 'react';
import { View, Button, TextInput, Text } from 'react-native';
import { RegLogTextInput, SignButton } from '../../Styles';
import { connect } from 'react-redux';
import axios from 'axios';
class RegisterScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            email:'',
            password:'',
            login: '',
        }

        this.onSignUp = this.onSignUp.bind(this)
    }
    onSignUp(){
        const { email, password, login } = this.state
        axios.post('api/auth/registration/', {
            "username":login,
            "email":email,
            "password": password,
        }).then((response) => {
            console.log(response)
            this.setState({loggedIn: true})
        }).catch((error) => {console.log(error)})
    }
    render(){
        return (
            <View style={{flex:1, justifyContent: "center"}}>
                <RegLogTextInput 
                    placeholder="login" 
                    onChangeText={(login) => this.setState({ login })}/>
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
const mapStateToProps = (state) => ({
    loggedIn: state.userState.loggedIn
})
export default connect(mapStateToProps)(RegisterScreen)