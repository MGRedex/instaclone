import firebase from 'firebase';
import React, { useEffect, useState, Component } from 'react';
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator, Button, TouchableOpacity, Touchable } from 'react-native';
import { connect } from 'react-redux';
import MarerialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { NickName, PostCreatorInfo, UserAvatar } from '../../Styles';
import axios from 'axios';
import { USER_FEED_LIKES_STATE_CHANGE } from '../../redux/constants'


export function Feed(props){
    const [posts, setPosts] = useState([])
    const [contentIsLoaded, setContentIsLoaded] = useState(false)


    useEffect(() => {
        const { dispatch, currentUser } = props
        if (props.feed !== undefined){
            setContentIsLoaded(true)
            setPosts(props.feed)
        }
    }, [props.feed])

    const onLikePress = (postId) => {
        const { dispatch } = props
        dispatch({type: USER_FEED_LIKES_STATE_CHANGE, postId, currentUserLike: true})
        axios.put(`api/feed/${postId}/like/`)
        .then((response) => {
            if(response.status == 204){return}
        })
        .catch((error) => {
            if (error.response.status == 500){
                dispatch({type: USER_FEED_LIKES_STATE_CHANGE, postId, currentUserLike: false})
            }
        })
    }

    const onDislikePress = (postId) => {
        const { dispatch } = props
        dispatch({type: USER_FEED_LIKES_STATE_CHANGE, postId, currentUserLike: false})
        axios.put(`api/feed/${postId}/dislike/`)
        .then((response) => {
            if(response.status == 204){return}
        })
        .catch((error) => {
            if (error.response.status == 500){
                dispatch({type: USER_FEED_LIKES_STATE_CHANGE, postId, currentUserLike: true})
            }
        })
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
                    <View style={{marginTop: 15}}>
                        <PostCreatorInfo>
                            <TouchableOpacity
                            onPress={() => props.navigation.navigate("Profile", {uid: item.author.user.id})}>
                                <UserAvatar
                                source={require('../../placeholder-images/Profile_avatar_placeholder_large.png')}/>
                            </TouchableOpacity>
                            <View style={{height: "100%", marginLeft: 7}}>
                                <NickName style={{marginTop: 4}}>{item.author.user.username}</NickName>
                                <Text style={{marginTop: 3}}>{item.caption}</Text>
                            </View>
                        </PostCreatorInfo>
                        {(item.content !== null) ? 
                        (
                            <Image
                            style={styles.image} 
                            source={{uri: axios.defaults.baseURL+item.content}}/>
                        ) : 
                        (
                            <View><Text>NO IMAGE</Text></View>
                        )
                        }
                        {item.currentUserLike ? 
                        (
                            <TouchableOpacity style={{marginLeft:2}} onPress={() => 
                                onDislikePress(item.id)}>
                                <MarerialCommunityIcons name="heart" color="#E94D4D" size={30}/>
                            </TouchableOpacity>
                        ) : 
                        (
                            <TouchableOpacity style={{marginLeft:2}} onPress={() => 
                                onLikePress(item.id)}>
                                <MarerialCommunityIcons name="heart-outline" color="#E94D4D" size={30}/>
                            </TouchableOpacity>
                        )}
                        <Text style={{marginLeft: 5}}
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
    }
})
const mapStateToProps = (state) => ({
    currentUser: state.userState.currentUser,
    feed: state.userState.feed,
})

export default connect(mapStateToProps)(Feed)