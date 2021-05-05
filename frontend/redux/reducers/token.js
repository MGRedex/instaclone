import {TOKEN_DECRYPTED_CHANGE} from '../constants/';

const initialState = {
    decrypted_token: null
}

export const token = (state = initialState, action) => {
    switch(action.type){
        case TOKEN_DECRYPTED_CHANGE:
            return {
                ...state,
                decrypted_token: action.jwt
            }
        default:
            return state

    }
}