import { 
    USERS_DATA_STATE_CHANGE,
    USER_AUTH_STATE_CHANGE, 
    USERS_LIKES_STATE_CHANGE,
    USER_FOLLOWING_STATE_CHANGE,
    USERS_FOLLOWER_STATE_CHANGE,
    CLEAR_USER_DATA,
    CLEAR_USERS_DATA } from '../../redux/constants';
import React, { useEffect, useState, Component } from 'react';
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator, Button, Touchable } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { NickName, ProfileButton, ProfileButtonsContainer, UserProfileAvatar, UserProfileMainInfo } from '../../Styles';
import axios from 'axios';
import { GetRefreshToken, DeleteTokens } from '../auth/Token'

export function Profile(props){
    const [user, setUser] = useState([])
    const [userPosts, setUserPosts] = useState(null)
    const [userFollowing, setUserFollowing] = useState(null)
    const [userFollowers, setUserFollowers] = useState(null)

    const [following, setFollowing] = useState(false)
    const [contentIsLoaded, setContentIsLoaded] = useState(false)
    const [showLoadingScreen, setShowLoadingScreen] = useState(true)

    const Thousand = 1000
    const Million = 1000000
    

    useEffect(() => {
        const { currentUser, posts, following, followers, users } = props
        const { dispatch } = props
        if (props.route.params.uid == currentUser.id){
            if (currentUser !== undefined){
                setUser(currentUser)
                setUserPosts(posts)
                setUserFollowing(following)
                setUserFollowers(followers)
                setContentIsLoaded(true)
                setShowLoadingScreen(false)
            }
            
        }
        else{

            let gettedUser = props.users.find(
                (profile) => profile.user.id == props.route.params.uid)
            
            if (gettedUser === undefined){
                setContentIsLoaded(false)
                setShowLoadingScreen(true)
                axios.get(`api/userinfo/${props.route.params.uid}/`)
                .then((response) => {
                    gettedUser = response.data
                    setUser(gettedUser.user)
                    setUserPosts(gettedUser.posts)
                    setUserFollowing(gettedUser.following)
                    setUserFollowers(gettedUser.followers)
                    dispatch({type: USERS_DATA_STATE_CHANGE, user: gettedUser})
                 })
            }
            else{

                setUser(gettedUser.user)
                setUserPosts(gettedUser.posts)
                setUserFollowing(gettedUser.following)
                setUserFollowers(gettedUser.followers)
                
                if (userFollowers.find(
                    (follower) => (
                        follower?.user?.id ? 
                        follower.user.id == currentUser.id : 
                        undefined)
                   
                    ))
                {
                    setFollowing(true)
                    console.log('Following setted')
                }
                else{
                    setFollowing(false)
                }
                setContentIsLoaded(true)
                setShowLoadingScreen(false)
            }

            
        }
        
    }, [props.route.params, 
        props.currentUser, 
        props.posts, 
        props.following, 
        props.followers, 
        props.users,
        user,
        userPosts,
        userFollowers,
        userFollowing])

    const onFollow = () => {
        setShowLoadingScreen(false)
        const { dispatch, currentUser } = props
        const { id } = user
        axios.put(`api/follow_system/${id}/follow/`)
        .then((response) => {
            if(response.status == 204){
                dispatch({type: USERS_FOLLOWER_STATE_CHANGE, follower: currentUser, user})
                dispatch({type: USER_FOLLOWING_STATE_CHANGE, following: [{user}]})
            }
        })
        
        
    }

    const onUnfollow = () => {
        const { dispatch, currentUser} = props
        const { id } = user
        axios.put(`api/follow_system/${id}/unfollow/`)
        .then((response) => {
            if(response.status == 204){
                dispatch({type: USERS_FOLLOWER_STATE_CHANGE, delete: true, follower: currentUser, user})
                dispatch({type: USER_FOLLOWING_STATE_CHANGE, delete: true , following: user})

            }
        })
        
    }

    const onLogout = () => {
        const { dispatch } = props
        GetRefreshToken().then(
            (token) => {
                dispatch({type: USER_AUTH_STATE_CHANGE, loggedIn: false})
                DeleteTokens()
                axios.post(
                    'api/auth/logout/', 
                    data = {'refresh_token': token}
                )
            }
        )
    }

    // const onMessage = () => {
    //     const { dispatch, currentUser} = props
    //     const { id } = user
    //     axios.put(`api/follow_system/${id}/unfollow/`)
    //     .then((response) => {
    //         if(response.status == 204){
    //             dispatch({type: USERS_FOLLOWER_STATE_CHANGE, delete: true, follower: currentUser, user})
    //             dispatch({type: USER_FOLLOWING_STATE_CHANGE, delete: true , following: user})

    //         }
    //     })
        
    // }

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
                            {userFollowers.length > Million ? 
                            (<Text>{(userFollowers.length/Million).toFixed(1)}M Followers</Text>) :
                            userFollowers.length > Thousand ?
                            (<Text>{(userFollowers.length/Thousand).toFixed(1)}K Followers</Text>) :
                            (<Text>{userFollowers.length} Followers</Text>)
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
            {props.route.params.uid !== props.currentUser.id ? ( 
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
                        <ProfileButton onPress={() => props.navigation.navigate("Chat", {oppositeUserId: props.route.params.uid})}>
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
            <View style={styles.userGallery}>
                <FlatList
                numColumns={3}
                horizontal={false}
                data={userPosts}
                renderItem={({item}) => (
                    <View style={styles.imageContainer}>
                        <Image
                        style={styles.image} 
                        source={{uri: axios.defaults.baseURL+item.content}}/>
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
        followers: store.userState.followers,
        users: store.usersState.users,
    }
}

export default connect(mapStateToProps)(Profile)