import React, { Component } from 'react';
import { View, Button, TextInput,Text } from 'react-native';
import firebase from 'firebase';
import { RegLogTextInput, SignButton } from '../../Styles';
import { connect } from 'react-redux';
import store from '../../redux/store/index';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import fetch_user from '../../redux/actions';
import { fetchUser } from '../../redux/actions';
import { bindActionCreators } from 'redux';
import { TOKEN_DECRYPTED_CHANGE, USER_AUTH_STATE_CHANGE } from '../../redux/constants/';
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
        const { dispatch } = this.props
        axios.post('api/auth/token/', {
            username:login,
            password
        }).then((response) => {
            let jwt = jwt_decode(response.data.access)
            // console.log(jwt)
            // console.log(payload)
            axios.defaults.headers.common = {'Authorization': `Bearer ${response.data.access}`}
            dispatch({type: TOKEN_DECRYPTED_CHANGE, jwt})
            // fetchUser(jwt.user_id)
        })
        dispatch({type: USER_AUTH_STATE_CHANGE, loggedIn: true})
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
    token: state.tokenState.decrypted_token,
})

// const mapDispatchToProps = (dispatch) => bindActionCreators({fetchUser}, dispatch)
export default connect(mapStateToProps)(LoginScreen)