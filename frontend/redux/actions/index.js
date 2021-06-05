import {
    USER_AUTH_STATE_CHANGE,
    USER_STATE_CHANGE, 
    USER_POSTS_STATE_CHANGE, 
    USER_FOLLOWING_STATE_CHANGE,
    USER_FOLLOWERS_STATE_CHANGE,
    USER_FEED_STATE_CHANGE,
    USERS_DATA_STATE_CHANGE,
    USERS_POSTS_STATE_CHANGE,
    USERS_LIKES_STATE_CHANGE,
    CLEAR_USER_DATA,
    CLEAR_USERS_DATA,
    USER_LIKED_POSTS_STATE_CHANGE,
    USER_WEBSOCKET_STATE_CHANGE,
    USER_CHAT_NEW_MESSAGE,
    USER_CHAT_STATE_CHANGE } from '../constants/index'

import axios from 'axios';

export function fetchUser(id){
    return ((dispatch) => {
        console.log('-------->fetching user')
        axios.get(`api/userinfo/${id}/`)
        .then((response) => {
            data = response.data
            dispatch({type: USER_STATE_CHANGE, currentUser: data.user})
            dispatch({type: USER_POSTS_STATE_CHANGE, posts: data.posts})
            dispatch({type: USER_FOLLOWING_STATE_CHANGE, following: data.following})
            dispatch({type: USER_FOLLOWERS_STATE_CHANGE, followers: data.followers})
            dispatch({type: USER_LIKED_POSTS_STATE_CHANGE, likedPosts: data.liked_posts})
        })
    })
}

export function fetchFeed(){
    return ((dispatch, getState) => {
        console.log('-------->fetching feed')
        axios.get(`api/feed/`)
        .then((response) => {
            const likedPosts = getState().userState.likedPosts
            data = response.data
            if (Object.keys(data).length != 0){
                data = data.map((post) => {
                    return (likedPosts.find((likedPost) => likedPost.id == post.id) ? 
                    {...post, currentUserLike: true} : 
                    {...post, currentUserLike: false})})
                    
                    dispatch({type: USER_FEED_STATE_CHANGE, feed: data})
            }
            console.log('NO DATA')
        })
    })
}

export function fetchChats(){
    return ((dispatch) => {
        console.log('-------->fetching chats')
        axios.get(`api/user_chats/`)
        .then((response) => {
            data = response.data
            if (Object.keys(data).length != 0){
                dispatch({type: USER_CHAT_STATE_CHANGE, chats: data})
            }
            console.log('NO DATA')
        })
    })
}

export function createWebsocket(token){
    return ((dispatch, getState) => {
        if (getState().userState.websocket === null){
            websocket = new WebSocket(`ws://192.168.1.104:8000/ws/chat/?token=${token}`)
            websocket.onopen = (event) => {
                console.log("CONNECTION ACCEPTED!")
            }
            websocket.onmessage = (event) => {
                data = JSON.parse(event.data)
                console.log(data)
                switch(data.type){
                    case 'new_chat':
                        dispatch({type: USER_CHAT_STATE_CHANGE, chats: [
                            {
                                oppositeUserId: data.oppositeUserId,
                                messages: data.messages,
                            }
                        ]})
                        console.log(`RECEIVED NEW CHAT WITH ${data["oppositeUserId"]}`)
                        break

                    case 'new_message':
                        dispatch(
                            {
                                type: USER_CHAT_NEW_MESSAGE, 
                                message: {
                                    sender: data.sender,
                                    receiver: data.receiver,
                                    text: data.text,
                                },
                                oppositeUserId: data.sender,
                            }
                        )
                        console.log(`RECEIVED MESSAGE FROM ${data["sender"]}`)
                        break

                }
            }
            dispatch({type: USER_WEBSOCKET_STATE_CHANGE, websocket})
        }
    })
}
export function clearData(){
    return ((dispatch) => {
        dispatch({type: CLEAR_USER_DATA})
        dispatch({type: CLEAR_USERS_DATA})
    })
}

