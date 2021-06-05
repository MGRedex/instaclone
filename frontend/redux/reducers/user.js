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
    USER_FEED_COMMENTS_STATE_CHANGE,
    USER_CHAT_STATE_CHANGE,
    USER_CHAT_NEW_MESSAGE,
    USER_WEBSOCKET_STATE_CHANGE } from '../constants';
    // {oppositeUserId: '2', messages:[
    //     {'sender': '11', 'receiver': '2', 'text':'Hello'},
    //     {'sender': '2', 'receiver': '11', 'text':'Hi'},
    //     {'sender': '2', 'receiver': '11', 'text':'Who are you? Want something?'},
    //     {'sender': '11', 'receiver': '2', 'text':'Yeah'},
    //     {'sender': '11', 'receiver': '2', 'text':'Wanna be friends?'},
    //     {'sender': '11', 'receiver': '2', 'text':'I am new here, just wanted to add some people to my feed, and also i am testing one shitty app hehe'},
    //     {'sender': '2', 'receiver': '11', 'text':'Ok man, now you will see some interesting photos of my dogs in your feed:D'},
    //     {'sender': '11', 'receiver': '2', 'text':'Wow'},
    //     {'sender': '11', 'receiver': '2', 'text':'That gonna be cool'},
    //     {'sender': '11', 'receiver': '2', 'text':'Btw'},
    //     {'sender': '11', 'receiver': '2', 'text':'Whats your name?'},
    //     {'sender': '2', 'receiver': '11', 'text':'Chris'},
    //     {'sender': '11', 'receiver': '2', 'text':'Ok Chris, mine is Mike'},
    // ]}
const initialState = {
    currentUser: null,
    loggedIn: false,
    following: [],
    followers: [],
    posts: [],
    feed: [],
    likedPosts: [],
    chats: [],
    websocket: null,
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
            
        case USER_LIKED_POSTS_STATE_CHANGE:
            return {
                ...state,
                likedPosts: [...state.likedPosts, ...action.likedPosts]
            } 

        case USER_FOLLOWING_STATE_CHANGE:
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

        case USER_CHAT_STATE_CHANGE:
            return {
                ...state,
                chats: [...state.chats, ...action.chats]
            }

        case USER_CHAT_NEW_MESSAGE:
            return {
                ...state,
                chats: state.chats.map((chat) => 
                    chat.oppositeUserId == action.oppositeUserId ? 
                    {...chat, messages: [...chat.messages, action.message]} :
                    chat
                )
            } 
        case USER_WEBSOCKET_STATE_CHANGE:
            return {
                ...state,
                websocket: action.websocket
            }

        case CLEAR_USER_DATA:
            return {...initialState, loggedIn: true}
        default:
            return state
    }
    
}