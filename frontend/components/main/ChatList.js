import React, { useEffect, useState, Component } from 'react';
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator, Button, TouchableOpacity, Touchable } from 'react-native';
import { connect } from 'react-redux';
import MarerialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { NickName, ChatInfo, UserAvatar } from '../../Styles';
import axios from 'axios';


export function ChatList(props){
    const [chatList, setChatList] = useState([])
    // const [contentIsLoaded, setContentIsLoaded] = useState(false)


    useEffect(() => {
        const { chats } = props
        setChatList(chats)
    }, props.chats)

    return (
        <View style={styles.container}>
            <View style={styles.userGallery}>
                <FlatList
                numColumns={1}
                horizontal={false}
                data={chatList}
                renderItem={({item}) => (
                    <View style={{marginTop: 15, marginLeft: 7}}>
                        <TouchableOpacity
                        onPress={() => props.navigation.navigate("Chat", {oppositeUserId: item.oppositeUserId})}
                        style={{flexDirection:'row'}}>
                            <TouchableOpacity
                            onPress={() => props.navigation.navigate("Profile", {uid: item.oppositeUserId})}>
                                <UserAvatar
                                source={require('../../placeholder-images/Profile_avatar_placeholder_large.png')}/>
                            </TouchableOpacity>
                            <View style={{height: "100%", marginLeft: 7}}>
                                <NickName style={{marginTop: 4}}>'username'</NickName>
                                {/* <Text style={{marginTop: 3}}>{item.lastMessage}</Text> */}
                            </View>
                        </TouchableOpacity>
                    </View>
                )}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40
    },
    userInfo: {
        margin: 20
    },
    userGallery: {
        flex: 1
    },
    imageContainer:{
        flex: 1/3,
        marginTop: 15
    },
    image:{
        flex:1,
        aspectRatio: 1/1
    },
    indicator:{
        flex:1, 
        justifyContent: 'center'
    },
    noFeed:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
const mapStateToProps = (state) => ({
    currentUser: state.userState.currentUser,
    chats: state.userState.chats,
})

export default connect(mapStateToProps)(ChatList)