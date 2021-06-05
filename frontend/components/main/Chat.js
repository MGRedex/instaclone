import React from "react";
import { View, Text, Image, FlatList, Button, TextInput, Touchable } from "react-native";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { NickName, UserAvatarComments } from "../../Styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import MarerialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { USER_CHAT_STATE_CHANGE, USER_CHAT_NEW_MESSAGE } from '../../redux/constants'

export function Chat(props){
    const [userMessageText, setUserMessageText] = useState("")
    const [MessageInputRef, setMessageInputRef] = useState(null)
    const [chat, setChat] = useState([])

    useEffect(() => {
        const { chats } = props
        setChat(chats.find((some_chat) => some_chat.oppositeUserId == props.route.params.oppositeUserId))
        
    }, [props.chats])

    const onMessageSend = () => {
        MessageInputRef.clear()

        const { dispatch } = props
        const messageDate = new Date()
        const message = {
            'receiver': `${props.route.params.oppositeUserId}`, 
            'text': `${userMessageText}`,
            'created': messageDate.toISOString().replace('T', ' ').replace('Z', ''),
        }
        
        props.websocket.send(JSON.stringify(message))

        if (chat === undefined){
            dispatch(
                {
                    type: USER_CHAT_STATE_CHANGE, 
                    chats:[
                        {
                            oppositeUserId: `${props.route.params.oppositeUserId}`,
                            messages: []
                        }
                    ]
                }
            )

        }

        dispatch(
            {
                type: USER_CHAT_NEW_MESSAGE, 
                oppositeUserId: props.route.params.oppositeUserId,
                message: {...message, sender: props.currentUser.id}
            }
        )
    }
    return(
        <View style={{flex:1}}>
            <FlatList
            numColumns={1}
            horizontal={false}
            data={chat !== undefined ? chat.messages : []}
            renderItem={({item}) => (
                (item.sender == props.currentUser.id) ? 
                (
                    <View style={{
                        flex:1, 
                        marginTop:10, 
                        alignItems: 'flex-end'}}>
                            <View style={{
                                marginRight:5, 
                                maxWidth:"80%", 
                                flexDirection:"row",
                                backgroundColor: '#76D86B',
                                borderRadius: 7,
                                padding: 10}}>
                                <Text>{item.text}</Text>
                            </View>
                    </View>
                ) : 
                (
                    <View style={{
                        flex:1, 
                        marginTop:10,
                        alignItems: 'flex-start'}}>
                        <View style={{
                            marginLeft:5, 
                            maxWidth:"80%", 
                            flexDirection:"row",
                            backgroundColor: '#7E7E7F',
                            borderRadius: 10,
                            padding: 10}}>
                                <Text>{item.text}</Text>
                        </View>
                    </View>
                )
            )}/>
            <View style={{
                flexDirection:"row", 
                alignItems:"flex-end"}}>
                <UserAvatarComments
                    style={{
                        margin:4,
                        flex:1}}
                    source={require('../../placeholder-images/Profile_avatar_placeholder_large.png')}/>
                <TextInput
                    ref={CommentInputRef => {setMessageInputRef(CommentInputRef)}}
                    multiline={true}
                    style={{
                        flex:7,
                        width: "77%",
                        height: "100%"}}
                    placeholder="Write a comment" 
                    onChangeText={(text) => setUserMessageText(text)}/>
                <TouchableOpacity
                    style={{
                        margin:4}}
                    onPress={() => onMessageSend()}>
                    <MarerialCommunityIcons name="send" color="#1A1A1A" size={30}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    chats: store.userState.chats,
    websocket: store.userState.websocket,
    feed: store.userState.feed,
    users: store.usersState.users,
})
export default connect(mapStateToProps)(Chat)