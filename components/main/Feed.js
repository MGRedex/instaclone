import firebase from 'firebase';
import React, { useEffect, useState, Component } from 'react';
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator, Button } from 'react-native';
import { connect } from 'react-redux';

export function Feed(props){
    const [posts, setPosts] = useState([])
    const [contentIsLoaded, setContentIsLoaded] = useState(false)


    useEffect(() => {
        let posts = []
        if (props.following !== undefined){
            setContentIsLoaded(true)
            if (props.usersLoaded === props.following.length){
                for (let i = 0; i < props.following.length; i++){
                    const user = props.users.find(el => el.uid === props.following[i])
                    if (user != undefined){
                        posts = [...posts, ...user.posts]
                    }
                }
    
                posts.sort(function (x,y){
                    return x.creation - y.creation
                })
    
                setPosts(posts)
            }
        }
        
    }, [props.usersLoaded, props.following])

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
    users: state.usersState.users,
    usersLoaded: state.usersState.usersLoaded
})

export default connect(mapStateToProps, null)(Feed)