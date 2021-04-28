import React, { useState } from 'react'; 
import { View, Image, TextInput, Text, Button } from 'react-native';
import firebase from 'firebase';
require('firebase/firestore');
require('firebase/firebase-storage');

export default function Save({navigation, route}){
    const [caption, setCaption] = useState("")
    const uploadImage = async () => {
        const uri = route.params.image
        const response = await fetch(uri)
        const blob = await response.blob()
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`

        const task = firebase
        .storage()
        .ref()
        .child(childPath)
        .put(blob)

        const taskProgress = (snapshot) => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
                console.log(snapshot)
            })
        }

        const taskError = (snapshot) => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted)

        const savePostData = (downloadURL) => {
            firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection('userPosts')
            .doc(`${Math.random().toString(36)}`)
            .set({
                downloadURL,
                caption,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).then((function(){
                navigation.popToTop()
            }))
        }
    }
    return(
        <View style={{flex:1}}>
            <Image source={{uri: route.params.image}} style={{flex:1}}/>
            <TextInput 
            placeholder="Write a caption..."
            onChangeText={(caption) => setCaption(caption)}/>
            <Button title="Save" onPress={() => uploadImage()}/>
        </View>
    )
}