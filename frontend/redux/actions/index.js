import {
    USER_AUTH_STATE_CHANGE,
    USER_STATE_CHANGE, 
    USER_POSTS_STATE_CHANGE, 
    USER_FOLLOWING_STATE_CHANGE,
    USERS_DATA_STATE_CHANGE,
    USERS_POSTS_STATE_CHANGE,
    USERS_LIKES_STATE_CHANGE,
    CLEAR_DATA} from '../constants/index'

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
            dispatch({type: USER_STATE_CHANGE, currentUser: data.user})
            dispatch({type: USER_POSTS_STATE_CHANGE, posts: data.posts})
            dispatch({type: USER_FOLLOWING_STATE_CHANGE, following: data.following})
        })
    })
}

