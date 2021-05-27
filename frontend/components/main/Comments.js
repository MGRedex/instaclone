import React from "react";
import { View, Text, Image, FlatList, Button, TextInput, Touchable } from "react-native";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { NickName, UserAvatarComments } from "../../Styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import MarerialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios';
import { USER_FEED_COMMENTS_STATE_CHANGE } from '../../redux/constants'

export function Comments(props){
    const [comments, setComments] = useState([])
    const [userComment, setUserComment] = useState("")
    const [CommentInputRef, setCommentInputRef] = useState(null)

    useEffect(() => {
        const { postId } = props.route.params
        const { dispatch } = props
        const post = props.feed.find((post) => post.id == postId)
        if (!post.comments){
            axios.get(`api/post_comments/${postId}/`).then(
                (result) => {
                    dispatch({type: USER_FEED_COMMENTS_STATE_CHANGE, comments:result.data, postId})
                    setComments(result.data)
                }
            )
        }
        else{
            setComments(post.comments)
        }
        console.log(props.feed)
    }, [props.feed, comments])

    const onCommentSend = () => {
        CommentInputRef.clear()
        
    }
    return(
        <View style={{flex:1}}>
            <FlatList
            numColumns={1}
            horizontal={false}
            data={comments}
            renderItem={({item}) => (
                <View style={{flex:1, marginTop:10, marginLeft:4}}>
                    <View style={{flexDirection:"row"}}>
                        <UserAvatarComments
                            source={require('../../placeholder-images/Profile_avatar_placeholder_large.png')}/>
                        <View style={{marginLeft:5, width:"85%"}}>
                            {item.user !== undefined ? (<NickName>{item.user.username}</NickName>) : null}
                            <Text>{item.text}</Text>
                        </View>
                    </View>
                </View>
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
                    ref={CommentInputRef => {setCommentInputRef(CommentInputRef)}}
                    multiline={true}
                    style={{
                        flex:7,
                        width: "77%",
                        height: "100%"}}
                    placeholder="Write a comment" 
                    onChangeText={(text) => setUserComment(text)}/>
                <TouchableOpacity
                    style={{
                        margin:4}}
                    onPress={() => onCommentSend()}>
                    <MarerialCommunityIcons name="send" color="#1A1A1A" size={30}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    feed: store.userState.feed,
    users: store.usersState.users,
})
export default connect(mapStateToProps)(Comments)