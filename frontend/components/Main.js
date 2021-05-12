import React, {Component} from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, fetchUserPosts, fetchFeed, clearData } from '../redux/actions/index';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import FeedScreen from './main/Feed';
import MarerialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ProfileScreen from './main/Profile';
import AddScreen from './main/Add';
import SearchScreen from './main/Search';
import axios from 'axios';

const Tab = createMaterialBottomTabNavigator()
const EmptyScreen = () => {
    return(null)
}
export class MainScreen extends Component{
    componentDidMount(){
        const { token } = this.props
        const { fetchUser, fetchFeed } = this.props
        fetchUser(token.user_id)
        fetchFeed()
    }
    render(){
        const { token } = this.props
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
                }}/>
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
                }}/> */}
                <Tab.Screen name="Profile" component={ProfileScreen}
                listeners={({ navigation })=>({
                    tabPress: event => {
                        event.preventDefault()
                        navigation.navigate("Profile", {uid: token.user_id})
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
    token: state.tokenState.decrypted_token,
})
const mapDispatchToProps = (dispatch) => bindActionCreators({fetchUser, fetchFeed, clearData}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);