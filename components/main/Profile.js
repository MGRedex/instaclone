import React from 'react';
import { StyleSheet, View, Text, Image, FlatList } from 'react-native';
import { connect } from 'react-redux';

export function Profile(props){
    const { currentUser, posts } = props
    console.log(props)
    return (
        <View style={styles.container}>
            <View styles={styles.userInfo}>
                <Text>{currentUser.name}</Text>
                <Text>{currentUser.email}</Text>
            </View>
            <View style={styles.userGallery}>
                <FlatList
                numColumns={3}
                horizontal={false}
                data={posts}
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
    }
})
const mapStateToProps = (state) => ({
    currentUser: state.userState.currentUser,
    posts: state.userState.posts
})

export default connect(mapStateToProps, null)(Profile)