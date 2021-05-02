import firebase from 'firebase';
import React, { useEffect, useState, Component } from 'react';
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator, Button, TouchableOpacity, Touchable } from 'react-native';
import { connect } from 'react-redux';
import MarerialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { NickName, PostCreatorInfo, UserAvatar } from '../../Styles';


export function Feed(props){
    const [posts, setPosts] = useState([])
    const [contentIsLoaded, setContentIsLoaded] = useState(false)


    useEffect(() => {
        if (props.following !== undefined && props.feed !== undefined){
            setContentIsLoaded(true)
            if (props.usersFollowingLoaded === props.following.length && props.following.length !== 0){
                props.feed.sort(function (x,y){
                    return x.created - y.created
                })
    
                setPosts(props.feed)
            }
        }
        
    }, [props.usersFollowingLoaded, props.following, props.feed])

    const onLikePress = (uid, postId) => {
        
    }

    const onDislikePress = (uid, postId) => {
        
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
                            onPress={() => props.navigation.navigate("Profile", {uid: item.user.uid})}>
                                <UserAvatar
                                source={require('../../placeholder-images/Profile_avatar_placeholder_large.png')}/>
                            </TouchableOpacity>
                            <View style={{height: "100%", marginLeft: 7}}>
                                <NickName style={{marginTop: 4}}>{item.user.name}</NickName>
                                <Text style={{marginTop: 3}}>{item.caption}</Text>
                            </View>
                        </PostCreatorInfo>
                        <Image
                        style={styles.image} 
                        source={{uri: item.downloadURL}}/>
                        {item.currentUserLike ? 
                        (
                            <TouchableOpacity style={{marginLeft:2}} onPress={() => 
                                onDislikePress(item.user.uid, item.id)}>
                                <MarerialCommunityIcons name="heart" color="#E94D4D" size={30}/>
                            </TouchableOpacity>
                        ) : 
                        (
                            <TouchableOpacity style={{marginLeft:2}} onPress={() => 
                                onLikePress(item.user.uid, item.id)}>
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
    following: state.userState.following,
    feed: state.usersState.feed,
    usersFollowingLoaded: state.usersState.usersFollowingLoaded
})

export default connect(mapStateToProps, null)(Feed)