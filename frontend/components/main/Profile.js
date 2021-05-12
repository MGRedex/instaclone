import { 
    USERS_DATA_STATE_CHANGE, 
    USERS_LIKES_STATE_CHANGE,
    USER_FOLLOWING_STATE_CHANGE,
    USER_FOLLOWERS_STATE_CHANGE,
    CLEAR_DATA } from '../../redux/constants';
import React, { useEffect, useState, Component } from 'react';
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator, Button, Touchable } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { NickName, ProfileButton, ProfileButtonsContainer, UserProfileAvatar, UserProfileMainInfo } from '../../Styles';
import axios from 'axios';

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
    // console.log(props)

    useEffect(() => {
        const { currentUser, posts, following, followers, users } = props
        const { dispatch } = props
        if (props.route.params.uid === props.token.user_id){
            if (currentUser !== null){
                setContentIsLoaded(true)
                setShowLoadingScreen(false)
            }
            setUser(currentUser)
            setUserPosts(posts)
            setUserFollowing(following)
            setUserFollowers(followers)
        }
        else{
            setContentIsLoaded(false)

            let gettedUser = props.users.find(
                (profile) => profile.user.id == props.route.params.uid)
            
            if (gettedUser === undefined){
                axios.get(`api/userinfo/${props.route.params.uid}/`)
                .then((response) => {
                    gettedUser = response.data
                    setUser(gettedUser.user)
                    setUserPosts(gettedUser.posts)
                    setUserFollowing(gettedUser.following)
                    setUserFollowers(gettedUser.followers)
                    dispatch({type: USERS_DATA_STATE_CHANGE, user: gettedUser})
                    setContentIsLoaded(true)
                    setShowLoadingScreen(false)
                 })
            }
            else{
                const { currentUser } = props

                setUser(gettedUser.user)
                setUserPosts(gettedUser.posts)
                setUserFollowing(gettedUser.following)
                setUserFollowers(gettedUser.followers)
            
                if (userFollowers.find((profile) => profile.user.id == currentUser.id)){
                    setFollowing(true)
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
        props.users])

    const onFollow = () => {
        setShowLoadingScreen(false)
        setFollowing(true)
        const { dispatch } = props
        const { uid } = user
        axios.put(`api/follow_system/${uid}/follow/`)
        .then((response) => {
            if(response.status == 204){
                dispatch({type: USER_FOLLOWERS_STATE_CHANGE, followers: [currentUser]})
                dispatch({type: USER_FOLLOWING_STATE_CHANGE, following: [user]})
            }
        })
        .catch((error) => {
            if (error.response.status == 500){
                setFollowing(false)
            }
        })
        
    }

    const onUnfollow = () => {
        setShowLoadingScreen(false)
        setFollowing(false)
        const { dispatch } = props
        const { id } = user
        axios.put(`api/follow_system/${id}/unfollow/`)
        .then((response) => {
            if(response.status == 204){
                console.log(user)
                dispatch({type: USER_FOLLOWERS_STATE_CHANGE, followers: currentUser, delete: true})
                dispatch({type: USER_FOLLOWING_STATE_CHANGE, following: user, delete: true})

            }
        })
        .catch((error) => {
            if (error.response.status == 500){
                setFollowing(true)
            }
        })
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
        followers: store.userState.followers,
        users: store.usersState.users,
        token: store.tokenState.decrypted_token,
    }
}

export default connect(mapStateToProps)(Profile)