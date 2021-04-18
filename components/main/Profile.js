import firebase from 'firebase';
import React, { useEffect, useState, Component } from 'react';
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator, Button } from 'react-native';
import { connect } from 'react-redux';
import { NickName, UserProfileAvatar, UserProfileMainInfo } from '../../Styles';

export function Profile(props){
    const [user, setUser] = useState([])
    const [userPosts, setUserPosts] = useState(null)
    const [contentIsLoaded, setContentIsLoaded] = useState(false)
    const [following, setFollowing] = useState(false)

    useEffect(() => {
        const { currentUser, posts } = props
        if (props.route.params.uid === firebase.auth().currentUser.uid){
            if (currentUser !== null){
                setContentIsLoaded(true)
            }
            setUser(currentUser)
            setUserPosts(posts)
        }
        else{
            firebase.firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .get()
            .then((snapshot) => {
                if(snapshot.exists){
                    setUser(snapshot.data())
                }
                else {
                    console.log("does not exist")
                }
            })
            firebase.firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .orderBy("createdAt", "asc")
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const id = doc.id
                    return {id, ...data}
                })
                setUserPosts(posts)
            })
            setContentIsLoaded(true)

            if (props.following.indexOf(props.route.params.uid) > -1){
                setFollowing(true)
            }
            else{
                setFollowing(false)
            }
        }
    }, [props.route.params.uid, props.currentUser, props.posts, props.following])

    const onFollow = () => {
        firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .doc(props.route.params.uid)
        .set({})
    }

    const onUnfollow = () => {
        firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .doc(props.route.params.uid)
        .delete()
    }

    const onLogout = () => {
        firebase.auth().signOut()
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
            <View styles={styles.userInfo}>
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    <UserProfileAvatar
                        style={{
                            margin:4,
                            marginLeft:8
                        }}
                        source={require('../../placeholder-images/Profile_avatar_placeholder_large.png')}/>
                    <View style={{flex:1}}>
                        <NickName style={{fontSize:20, marginBottom:7}}>{user.name}</NickName>
                        <View style={{
                            width:"100%",
                            flexDirection:"row",
                            justifyContent:"space-between"}}>
                            <Text>{userPosts.length} Posts</Text>
                            <Text>|</Text>
                            <Text>2 Followers</Text>
                            <Text>|</Text>
                            <Text style={{marginRight:8}}>3 Subscribes</Text>
                        </View>
                    </View>
                </View>
                {props.route.params.uid !== firebase.auth().currentUser.uid ? ( 
                    <View>
                        {following 
                        ?(<Button 
                            title="Unfollow"
                            onPress={() => onUnfollow()}/>)
                        :(<Button 
                            title="Follow"
                            onPress={() => onFollow()}/>)}
                    </View>) 
                : (<Button 
                    title="Logout"
                    onPress={() => onLogout()}/>)
                }  
            </View>
            <View style={styles.userGallery}>
                <FlatList
                numColumns={3}
                horizontal={false}
                data={userPosts}
                renderItem={({item}) => (
                    <View style={styles.imageContainer}>
                        <Image
                        style={styles.image} 
                        source={{uri: item.downloadURL}}/>
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
    posts: state.userState.posts,
    following: state.userState.following
})

export default connect(mapStateToProps, null)(Profile)