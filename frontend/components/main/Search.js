import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import MarerialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { NickName, UserAvatar } from '../../Styles';

export default function Search({navigation}){
    const [users, setUsers] = useState([])
    const FollowersPlaceholder = 1327026
    const FollowingPlaceholder = 4489
    const Thousand = 1000
    const Million = 1000000
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
        <View style={{flex:1}}>
            <View style={{
                width:"90%",
                flexDirection:"row",
                marginTop:40,
                marginLeft:"5%",
                marginRight:"5%",
                borderRadius:10,
                backgroundColor:"#DDDDDD",
                alignItems: "center",
                padding: 4}}>
                <MarerialCommunityIcons name="magnify" color="#AAAAAA" size={25}/>
                <TextInput
                style={{width:"90%"}} 
                placeholder="Type here" 
                onChangeText={(search) => fetchUsers(search)}/>
            </View>
            <View style={{
                width:"94%",
                marginTop:20,
                marginLeft:"3%",
                marginRight:"3%",}}>
                <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({item}) => (
                    <TouchableOpacity
                    style={{
                        flexDirection:"row",
                        alignItems:"center"
                    }}
                    onPress={() => navigation.navigate("Profile", {uid: item.id})}>
                        <UserAvatar 
                            style={{
                                margin:4
                            }}
                            source={require('../../placeholder-images/Profile_avatar_placeholder_large.png')}/>
                        <View
                            style={{flex:1}}>
                            <NickName>{item.name}</NickName>
                            <View style={{
                                width:"100%",
                                flexDirection:"row",
                                justifyContent:"space-between"}}>
                                {3 > Million ?
                                (<Text>{(3/Million).toFixed(1)}M Posts</Text>) :
                                3 > Thousand ?
                                (<Text>{(3/Thousand).toFixed(1)}K Posts</Text>) :
                                (<Text>{3} Posts</Text>)
                                }
                                <Text>|</Text>
                                {FollowersPlaceholder > Million ? 
                                (<Text>{(FollowersPlaceholder/Million).toFixed(1)}M Followers</Text>) :
                                FollowersPlaceholder > Thousand ?
                                (<Text>{(FollowersPlaceholder/Thousand).toFixed(1)}K Followers</Text>) :
                                (<Text>{FollowersPlaceholder} Followers</Text>)
                                }
                                <Text>|</Text>
                                {FollowingPlaceholder > Million ? 
                                (<Text style={{marginRight:8}}>
                                    {(FollowingPlaceholder/Million).toFixed(1)}M Following</Text>) :
                                FollowingPlaceholder > Thousand ?
                                (<Text style={{marginRight:8}}>
                                    {(FollowingPlaceholder/Thousand).toFixed(1)}K Following</Text>) :
                                (<Text style={{marginRight:8}}>
                                    {FollowingPlaceholder} Following</Text>)
                                }
                            </View>
                        </View>
                    </TouchableOpacity>
                )}/>
            </View>
        </View>
    )
}