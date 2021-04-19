import React from "react";
import { View, Text, Image, FlatList, Button, TextInput, Touchable } from "react-native";
import { useState, useEffect } from "react";
import firebase from "firebase";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUsersData } from "../../redux/actions/index";
import { NickName, UserAvatarComments } from "../../Styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import MarerialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
require("firebase/firestore")

export function Comments(props){
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState("")
    const [userComment, setUserComment] = useState("")
    const [CommentInputRef, setCommentInputRef] = useState(null)

    useEffect(() => {
        function matchUserToComment(comments){
            for(let i = 0; i < comments.length; i++){
                if (comments[i].hasOwnProperty("user")){
                    continue
                }
                else{
                    const user = props.users.find(el => el.uid === comments[i].creator)
                    if (user === undefined){
                        props.fetchUsersData(comments[i].creator, false)
                    }
                    else{
                        comments[i].user = user
                    }
                }
                
            }
            setComments(comments)
        }
        if(props.route.params.postId !== postId){
            firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .doc(props.route.params.postId)
                .collection("comments")
                .orderBy("createdAt")
                .onSnapshot((snapshot) => {
                    let comments = snapshot.docs.map((doc) => {
                        let data = doc.data()
                        let id = doc.id
                        return {id, ...data}
                    })
                    matchUserToComment(comments)
                })
            setPostId(props.route.params.postId)
        }
        else{
            matchUserToComment(comments)
        }
    }, [props.route.params.postId, props.users])

    const onCommentSend = () => {
        CommentInputRef.clear()
        firebase.firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .doc(props.route.params.postId)
            .collection("comments")
            .add({
                creator: firebase.auth().currentUser.uid,
                text: userComment,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            })
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
                            {item.user !== undefined ? (<NickName>{item.user.name}</NickName>) : null}
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
    users: store.usersState.users
})
const mapDispatchToProps= (dispatch) => bindActionCreators({ fetchUsersData },dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Comments)