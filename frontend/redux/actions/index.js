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
    CLEAR_DATA,
    USER_LIKED_POSTS_STATE_CHANGE} from '../constants/index'

import axios from 'axios';

export function clearData(){
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA, })
    })
}

export function fetchUser(id){
    return ((dispatch) => {
        console.log('-------->fetching user')
        axios.get(`api/userinfo/${id}/`)
        .then((response) => {
            data = response.data
            // console.log(data)
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
            
            data = data.map((post) => {
            return (likedPosts.find((likedPost) => likedPost.id == post.id) ? 
            {...post, currentUserLike: true} : 
            {...post, currentUserLike: false})})
            
            dispatch({type: USER_FEED_STATE_CHANGE, feed: data})
            
        })
    })
}

