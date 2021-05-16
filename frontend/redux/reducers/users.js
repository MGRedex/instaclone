import { 
    USERS_DATA_STATE_CHANGE, 
    USERS_LIKES_STATE_CHANGE,
    USERS_FOLLOWER_STATE_CHANGE,
    CLEAR_USERS_DATA } from '../constants';

    const initialState = {
    users: [],
    usersFollowingLoaded: 0
}

export const users = (state = initialState, action) => {
    switch(action.type){
        case USERS_DATA_STATE_CHANGE:
            return {
                ...state,
                users: [...state.users, action.user]
            }
        case USERS_FOLLOWER_STATE_CHANGE:
            console.log("-------------usersFollower-------------")
            if(action.delete){
                return {
                    ...state,
                    users: state.users.map(
                        (profile) => {
                            if(profile.user.id == action.user.id){
                                return {
                                    ...profile, 
                                    followers: profile.followers.filter(
                                        (follower) => follower.user.id != action.follower.id)
                                }   
                            }
                            else{
                                return profile
                            }
                        }) 
                }
            }
            return {
                ...state,
                users: state.users.map(
                    (profile) => {
                        if(profile.user.id == action.user.id){
                            return {
                                ...profile, 
                                followers: [
                                    ...profile.followers,
                                    {user: action.follower}]
                            }   
                        }
                        else{
                            return profile
                        }
                    }) 
            }
        case USERS_LIKES_STATE_CHANGE:
            return {
                ...state,
                feed: state.feed.map((post) => 
                    post.id == action.postId ? 
                    {...post, currentUserLike: action.currentUserLike} :
                    post
                )
            }
        case CLEAR_USERS_DATA:
            return initialState
        default:
            return state
    }
    
}