import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import LandingScreen from './components/auth/Landing';
import * as firebase from 'firebase';
import RegisterScreen from './components/auth/Register';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';

const store = createStore(rootReducer, applyMiddleware(thunk))
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlmVhpP1-CU_v3lEFPmmxC_9EYsbb3H0U",
  authDomain: "instagram-dev-54fe6.firebaseapp.com",
  projectId: "instagram-dev-54fe6",
  storageBucket: "instagram-dev-54fe6.appspot.com",
  messagingSenderId: "767602202007",
  appId: "1:767602202007:web:ea738d6ee3021d7f3720d2",
  measurementId: "G-302YBB2VTC"
};

if (firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig)
}

const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: false,
    }
  }
  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      }
      else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }
  render(){
    const { loggedIn, loaded } = this.state;
    if (!loaded){
      return(
        <View style={{flex:1, justifyContent: 'center'}}>
          <Text>Loading</Text>
        </View>
      )
    }
    if (!loggedIn){
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }}/> 
            <Stack.Screen name="Register" component={RegisterScreen}/> 
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return(
      <View style={{flex:1, justifyContent: 'center'}}>
        <Text>Logged in</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
