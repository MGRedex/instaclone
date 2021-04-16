import React from "react";
import { View, Text, Image, FlatList, Button, TextInput } from "react-native";
import { useState, useEffect } from "react";
import firebase from "firebase";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUsersData } from "../../redux/actions/index";
require("firebase/firestore")

export function Comments(props){
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState("")
    const [userComment, setUserComment] = useState("")

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
                .get()
                .then((snapshot) => {
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
        firebase.firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .doc(props.route.params.postId)
            .collection("comments")
            .add({
                creator: firebase.auth().currentUser.uid,
                text: userComment
            })
    }
    return(
        <View style={{flex:1}}>
            <FlatList
            numColumns={1}
            horizontal={false}
            data={comments}
            renderItem={({item}) => (
                <View style={{flex:1}}>
                    {item.user !== undefined ? (<Text>{item.user.name}</Text>) : null}
                    <Text>{item.text}</Text>
                </View>
            )}/>
            <View>
                <TextInput placeholder="Write a comment" onChangeText={(text) => setUserComment(text)}/>
                <Button
                title="Send"
                onPress={
                    () => onCommentSend()
                }/>
            </View>
        </View>
    )
}
const mapStateToProps = (store) => ({
    users: store.usersState.users
})
const mapDispatchToProps= (dispatch) => bindActionCreators({ fetchUsersData },dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Comments)