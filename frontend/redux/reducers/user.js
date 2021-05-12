import { 
    USER_STATE_CHANGE, 
    USER_POSTS_STATE_CHANGE,
    USER_FOLLOWING_STATE_CHANGE,
    USER_FOLLOWERS_STATE_CHANGE,
    USER_FEED_STATE_CHANGE,
    USER_AUTH_STATE_CHANGE,
    CLEAR_DATA,
    USER_LIKED_POSTS_STATE_CHANGE,
    USER_FEED_LIKES_STATE_CHANGE } from '../constants';

const initialState = {
    currentUser: null,
    loggedIn: false,
    following: [],
    followers: [],
    posts: [],
    feed: [],
    likedPosts: [],
}

export const user = (state = initialState, action) => {
    switch(action.type){
        case USER_AUTH_STATE_CHANGE:
            return{
                ...state,
                loggedIn: action.loggedIn
            }
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        case USER_POSTS_STATE_CHANGE:
            return {
                ...state,
                posts: action.posts
            }
        case USER_FOLLOWING_STATE_CHANGE:
            if (action.delete){
                console.log('works')
                console.log(action.following)
                console.log(state)
                return {
                    ...state,
                    following: state.following.filter((profile) => profile.user.id != action.following.id)
                }
            }
            return {
                ...state,
                following: [...state.following, ...action.following]
            }
        case USER_FOLLOWERS_STATE_CHANGE:
            if (action.delete){
                return {
                    ...state,
                    following: state.followers.filter((profile) => profile.user.id != action.followers.id)
                }
            }
            return {
                ...state,
                followers: [...state.followers, ...action.followers]
            }
        case USER_LIKED_POSTS_STATE_CHANGE:
            return {
                ...state,
                likedPosts: [...state.likedPosts, ...action.likedPosts]
            } 
        case USER_FEED_STATE_CHANGE:
            return {
                ...state,
                feed: [...state.feed, ...action.feed]
            }
        case USER_FEED_LIKES_STATE_CHANGE:
            return {
                ...state,
                feed: state.feed.map((post) => 
                    post.id == action.postId ? 
                    {...post, currentUserLike: action.currentUserLike} :
                    post
                )
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state
    }
    
}