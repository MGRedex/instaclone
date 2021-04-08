import React, {Component} from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../redux/actions/index';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import FeedScreen from './main/Feed';
import MarerialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ProfileScreen from './main/Profile';
import AddScreen from './main/Add';

const Tab = createMaterialBottomTabNavigator()
const EmptyScreen = () => {
    return(null)
}
export class MainScreen extends Component{
    componentDidMount(){
        this.props.fetchUser()
    }

    render(){
        return(
            <Tab.Navigator initialRouteName="Feed" labeled={false}>
                <Tab.Screen name="Feed" component={FeedScreen}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <MarerialCommunityIcons name="home" color={color} size={26}/>
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
                }}/>
                <Tab.Screen name="Profile" component={ProfileScreen}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <MarerialCommunityIcons name="account-circle" color={color} size={26}/>
                    )
                }}/>
            </Tab.Navigator>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchToProps = (dispatch) => bindActionCreators({fetchUser}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);