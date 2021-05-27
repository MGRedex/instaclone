import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { LogBox, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Provider } from 'react-redux';
import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import MainScreen from './components/Main';
import AddScreen from './components/main/Add';
import LoginScreen from './components/auth/Login';
import SaveScreen from './components/main/Save';
import CommentsScreen from './components/main/Comments';
import { AppLogo, AppLogoContainer, AppName } from './Styles';
import { connect } from 'react-redux';
import axios from 'axios';
import thunk from 'redux-thunk';
import rootReducer from './redux/reducers/index';
import { createStore, applyMiddleware } from 'redux';
import * as SecureStore from 'expo-secure-store';
import { GetAccessToken } from './components/auth/Token';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
axios.defaults.baseURL = 'http://192.168.1.104:8000'

const store = createStore(rootReducer, applyMiddleware(thunk))
const Stack = createStackNavigator();
// LogBox.ignoreLogs(["Setting a timer"])


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: false,
    }
  }
  render(){
    const { loggedIn } = this.props;
    if (false){
      return(
        <AppLogoContainer>
          <AppLogo name="instagram" size={70}/>
        </AppLogoContainer>
      )
    }
    if (!loggedIn){
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }}/> 
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    return(
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Add" component={AddScreen}/>
            <Stack.Screen name="Save" component={SaveScreen}/>
            <Stack.Screen name="Comments" component={CommentsScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      )
  }
}
const mapStateToProps = (state) => ({
  loggedIn: state.userState.loggedIn,
})
App = connect(mapStateToProps)(App)
const AppWithStore = () => {
  return(
    <Provider store={store}>
      <App/>
    </Provider>
  )
}

export default AppWithStore