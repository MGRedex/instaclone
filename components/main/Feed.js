import firebase from 'firebase';
import React, { useEffect, useState, Component } from 'react';
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator, Button } from 'react-native';
import { connect } from 'react-redux';

export function Feed(props){
    const [posts, setPosts] = useState([])
    const [contentIsLoaded, setContentIsLoaded] = useState(false)


    useEffect(() => {
        if (props.following !== undefined && props.feed !== undefined){
            setContentIsLoaded(true)
            if (props.usersFollowingLoaded === props.following.length && props.following.length !== 0){
                props.feed.sort(function (x,y){
                    return x.creation - y.creation
                })
    
                setPosts(props.feed)
                console.log(props.feed)
            }
        }
        
    }, [props.usersFollowingLoaded, props.following, props.feed])

    const onLikePress = (uid, postId) => {
        firebase.firestore()
        .collection("posts")
        .doc(uid)
        .collection("userPosts")
        .doc(postId)
        .collection("likes")
        .doc(firebase.auth().currentUser.uid)
        .set({})
    }

    const onDislikePress = (uid, postId) => {
        firebase.firestore()
        .collection("posts")
        .doc(uid)
        .collection("userPosts")
        .doc(postId)
        .collection("likes")
        .doc(firebase.auth().currentUser.uid)
        .delete()
    }

    if(!contentIsLoaded){
        return(
            <View style={styles.indicator}>
                <ActivityIndicator 
                size='large' 
                color='black'
                />
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <View style={styles.userGallery}>
                <FlatList
                numColumns={1}
                horizontal={false}
                data={posts}
                renderItem={({item}) => (
                    <View style={styles.imageContainer}>
                        <Text style={styles.container}>{item.user.name}</Text>
                        <Image
                        style={styles.image} 
                        source={{uri: item.downloadURL}}/>
                        {item.currentUserLike ? 
                        (
                            <Button title="Dislike" onPress={() => 
                                onDislikePress(item.user.uid, item.id)}/>
                        ) : 
                        (
                            <Button title="Like" onPress={() => 
                                onLikePress(item.user.uid, item.id)}/>
                        )}
                        <Text
                        onPress={() => props.navigation.navigate(
                            "Comments", 
                            {
                                postId: item.id,
                                uid: item.user.uid
                                })}>
                            View all comments...
                        </Text>
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
        flex: 1/3
    },
    image:{
        flex:1,
        aspectRatio: 1/1
    },
    indicator:{
        flex:1, 
        justifyContent: 'center'
    }
})
const mapStateToProps = (state) => ({
    currentUser: state.userState.currentUser,
    following: state.userState.following,
    feed: state.usersState.feed,
    usersFollowingLoaded: state.usersState.usersFollowingLoaded
})

export default connect(mapStateToProps, null)(Feed)