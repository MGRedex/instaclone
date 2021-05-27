import { 
    USER_STATE_CHANGE, 
    USER_POSTS_STATE_CHANGE,
    USER_FOLLOWING_STATE_CHANGE,
    USER_FOLLOWERS_STATE_CHANGE,
    USER_FEED_STATE_CHANGE,
    USER_AUTH_STATE_CHANGE,
    CLEAR_USER_DATA,
    USER_LIKED_POSTS_STATE_CHANGE,
    USER_FEED_LIKES_STATE_CHANGE,
    USER_FEED_COMMENTS_STATE_CHANGE } from '../constants';

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
            console.log("-------------userFollowing-------------")
            if (action.delete){
                console.log(state.following)
                return {
                    ...state,
                    following: state.following.filter((followingProfile) => followingProfile.user.id != action.following.id)
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
                    followers: state.followers.filter((followingProfile) => followingProfile.user.id != action.followers.id)
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
        case USER_FEED_COMMENTS_STATE_CHANGE:
            return {...state, feed: state.feed.map((post) => {
                if (post.id == action.postId){
                    post["comments"] = action.comments
                    return post
                }
                return post
            })}
        case USER_FEED_LIKES_STATE_CHANGE:
            return {
                ...state,
                feed: state.feed.map((post) => 
                    post.id == action.postId ? 
                    {...post, currentUserLike: action.currentUserLike} :
                    post
                )
            }
        case CLEAR_USER_DATA:
            return {...initialState, loggedIn: true}
        default:
            return state
    }
    
}