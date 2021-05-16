import React, { useState } from 'react'; 
import { View, Image, TextInput, Text, Button } from 'react-native';
import axios from 'axios';
import FormData from 'form-data';

export default function Save({navigation, route}){
    const [caption, setCaption] = useState("")
    const uploadImage = async () => {

        let uri = route.params.image
        let formData = new FormData()
        let filename = uri.split('/').pop()

        formData.append('content', {uri, name: filename, type: 'image/jpg'})
        formData.append('caption', `${caption}`)

        axios.post('api/create_post/', 
        data = formData,
        {
            headers: {
                "content-type": "multipart/form-data"
            }
        })
        .then((response) => (navigation.navigate("Feed")))
        .catch((error) => console.log(error.response.data))
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