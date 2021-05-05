import firebase from 'firebase';
import React, { useEffect, useState, Component } from 'react';
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator, Button, Touchable } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { NickName, ProfileButton, ProfileButtonsContainer, UserProfileAvatar, UserProfileMainInfo } from '../../Styles';

export function Profile(props){
    const [user, setUser] = useState([])
    const [userPosts, setUserPosts] = useState(null)
    const [userFollowing, setUserFollowing] = useState(null)
    const [following, setFollowing] = useState(false)
    const [contentIsLoaded, setContentIsLoaded] = useState(false)
    const [showLoadingScreen, setShowLoadingScreen] = useState(true)
    const FollowersPlaceholder = 1327026
    const FollowingPlaceholder = 4489
    const Thousand = 1000
    const Million = 1000000
    // console.log(props)

    useEffect(() => {
        const { currentUser, posts, following } = props
        if (props.route.params.uid === props.token.user_id){
            if (currentUser !== null){
                setContentIsLoaded(true)
                setShowLoadingScreen(false)
            }
            setUser(currentUser)
            setUserPosts(posts)
            setUserFollowing(following)
            console.log(props)
        }
        else{
            setContentIsLoaded(false)
            
            // firebase.firestore()
            // .collection("posts")
            // .doc(props.route.params.uid)
            // .collection("userPosts")
            // .orderBy("createdAt", "asc")
            // .get()
            // .then((snapshot) => {
            //     let posts = snapshot.docs.map(doc => {
            //         const data = doc.data()
            //         const uid = doc.uid
            //         return {uid, ...data}
            //     })
            //     setUserPosts(posts)
            //     setContentIsLoaded(true)
            // })
            

            if (props.following.indexOf(props.route.params.uid) > -1){
                setFollowing(true)
            }
            else{
                setFollowing(false)
            }
        }
        
    }, [props.route.params, props.currentUser, props.posts, props.following])

    const onFollow = () => {
        setShowLoadingScreen(false)
        
    }

    const onUnfollow = () => {
        setShowLoadingScreen(false)
        
    }

    const onLogout = () => {
        
    }

    if(!contentIsLoaded && showLoadingScreen){
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
                        <NickName style={{fontSize:20, marginBottom:7}}>{user.username}</NickName>
                        <View style={{
                            wuidth:"100%",
                            flexDirection:"row",
                            justifyContent:"space-between"}}>
                            {userPosts.length > Million ?
                            (<Text>{(userPosts.length/Million).toFixed(1)}M Posts</Text>) :
                            userPosts.length > Thousand ?
                            (<Text>{(userPosts.length/Thousand).toFixed(1)}K Posts</Text>) :
                            (<Text>{userPosts.length} Posts</Text>)
                            }
                            <Text>|</Text>
                            {FollowersPlaceholder > Million ? 
                            (<Text>{(FollowersPlaceholder/Million).toFixed(1)}M Followers</Text>) :
                            FollowersPlaceholder > Thousand ?
                            (<Text>{(FollowersPlaceholder/Thousand).toFixed(1)}K Followers</Text>) :
                            (<Text>{FollowersPlaceholder} Followers</Text>)
                            }
                            <Text>|</Text>
                            {userFollowing.length > Million ? 
                            (<Text style={{marginRight:8}}>
                                {(userFollowing.length/Million).toFixed(1)}M Following</Text>) :
                            userFollowing.length > Thousand ?
                            (<Text style={{marginRight:8}}>
                                {(userFollowing.length/Thousand).toFixed(1)}K Following</Text>) :
                            (<Text style={{marginRight:8}}>
                                {userFollowing.length} Following</Text>)
                            }
                        </View>
                    </View>
                </View>
            </View>
            {props.route.params.uid !== props.token.user_id ? ( 
                    <ProfileButtonsContainer>
                        {following 
                        ?(<ProfileButton 
                            onPress={() => onUnfollow()}>
                                <Text>Unfollow</Text>
                            </ProfileButton>)
                        :(<ProfileButton 
                            onPress={() => onFollow()}>
                                <Text>Follow</Text>
                            </ProfileButton>)}
                        <ProfileButton>
                            <Text>Message</Text>
                        </ProfileButton>
                    </ProfileButtonsContainer>) 
                : (<ProfileButtonsContainer>
                        <ProfileButton onPress={() => onLogout()}>
                            <Text>Logout</Text>
                        </ProfileButton>
                        <ProfileButton>
                            <Text>Statistic</Text>
                        </ProfileButton>
                    </ProfileButtonsContainer>)
                } 
            {/* <View style={styles.userGallery}>
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
            </View> */}
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
        flex: 11
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
const mapStateToProps = (store) => {
    return {
        currentUser: store.userState.currentUser,
        posts: store.userState.posts,
        following: store.userState.following,
        token: store.tokenState.decrypted_token,
    }
}

export default connect(mapStateToProps)(Profile)