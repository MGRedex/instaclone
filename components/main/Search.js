import firebase from 'firebase';
import 'firebase/firestore';
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';

export default function Search({navigation}){
    const [users, setUsers] = useState([])
    const fetchUsers = (search) => {
        firebase.firestore()
        .collection("users")
        .where('name', '>=', search) 
        .get()
        .then((snapshot) => {
            let users = snapshot.docs.map(doc => {
                const data = doc.data()
                const id = doc.id
                return {id, ...data}
            })
            setUsers(users)
        })
    }
    return (
        <View>
            <TextInput 
            placeholder="Type here" 
            onChangeText={(search) => fetchUsers(search)}
            style={{marginTop:40}}/>
            <FlatList
            numColumns={1}
            horizontal={false}
            data={users}
            renderItem={({item}) => (
                <TouchableOpacity
                onPress={() => navigation.navigate("Profile", {uid: item.id})}>
                    <Text>{item.name}</Text>
                </TouchableOpacity>
            )}/>
        </View>
    )
}