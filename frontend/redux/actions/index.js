import {
    USER_AUTH_STATE_CHANGE, 
    USER_POSTS_STATE_CHANGE, 
    USER_FOLLOWING_STATE_CHANGE,
    USERS_DATA_STATE_CHANGE,
    USERS_POSTS_STATE_CHANGE,
    USERS_LIKES_STATE_CHANGE,
    CLEAR_DATA} from '../constants/index'

export function clearData(){
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA, })
    })
}

export function fetchUser(id){
    return ((dispatch) => {

    })
}

