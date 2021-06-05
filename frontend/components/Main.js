import React, {Component} from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, fetchChats, fetchFeed, clearData } from '../redux/actions/index';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import FeedScreen from './main/Feed';
import MarerialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ProfileScreen from './main/Profile';
import AddScreen from './main/Add';
import SearchScreen from './main/Search';
import axios from 'axios';
import { GetAccessToken } from './auth/Token';
import jwt_decode from 'jwt-decode';
import * as SecureStore from 'expo-secure-store';
import ChatList from './main/ChatList';

const Tab = createMaterialBottomTabNavigator()
const EmptyScreen = () => {
    return(null)
}
export class MainScreen extends Component{
    componentDidMount(){
        const { fetchUser, fetchFeed, fetchChats, clearData } = this.props
        clearData()
        GetAccessToken().then(
            (token) => {
                let token_decoded = jwt_decode(token)
                fetchUser(token_decoded.user_id)
            }
        )
        fetchFeed()
        fetchChats()
    }
    render(){
        const { currentUser } = this.props
        return(
            <Tab.Navigator 
            initialRouteName="Feed" 
            labeled={false}
            activeColor="black"
            barStyle={{backgroundColor:"white"}}>
                <Tab.Screen name="Feed" component={FeedScreen}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <MarerialCommunityIcons name="home" color={color} size={26}/>
                    )
                }}/>
                {/* <Tab.Screen name="Search" component={SearchScreen}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <MarerialCommunityIcons name="magnify" color={color} size={26}/>
                    )
                }}/> */}
                <Tab.Screen name="AddContainer" component={EmptyScreen}
                listeners={({ navigation })=>({
                    tabPress: event => {
                        event.preventDefault()
                        navigation.navigate("Add")
                    }
                })}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <MarerialCommunityIcons name="plus-box" color={color} size={26}/>
                    )
                }}/>
                <Tab.Screen name="ChatList" component={ChatList}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <MarerialCommunityIcons name="chat" color={color} size={26}/>
                    )
                }}/>
                <Tab.Screen name="Profile" component={ProfileScreen}
                listeners={({ navigation })=>({
                    tabPress: event => {
                        event.preventDefault()
                        navigation.navigate("Profile", {uid: currentUser.id})
                    }
                })}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <MarerialCommunityIcons name="account-circle" color={color} size={26}/>
                    )
                }}/>
            </Tab.Navigator>
        )
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.userState.currentUser,
})
const mapDispatchToProps = (dispatch) => bindActionCreators({fetchUser, fetchFeed, fetchChats, clearData}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);