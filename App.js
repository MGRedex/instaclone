import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { LogBox, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import * as firebase from 'firebase';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';
import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import MainScreen from './components/Main';
import AddScreen from './components/main/Add';
import LoginScreen from './components/auth/Login';
import SaveScreen from './components/main/Save';
import CommentsScreen from './components/main/Comments';

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
LogBox.ignoreLogs(["Setting a timer"])

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: false,
    }
  }
  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
      else {
        this.setState({
          loggedIn: false,
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
            <Stack.Screen name="Login" component={LoginScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return(
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Add" component={AddScreen}/>
            <Stack.Screen name="Save" component={SaveScreen}/>
            <Stack.Screen name="Comments" component={CommentsScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
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
