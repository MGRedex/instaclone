import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { TOKEN_DECRYPTED_CHANGE } from '../../redux/constants/';
import * as SecureStore from 'expo-secure-store';

export async function SetJWT(jwt){
    // const jwt_decoded = jwt_decode(jwt.access)
    axios.defaults.headers.common = {'Authorization': `Bearer ${jwt.access}`}
    await SecureStore.setItemAsync('access_token', jwt.access)
    await SecureStore.setItemAsync('refresh_token', jwt.refresh)
}

export async function GetAccessToken(){
    let access_token = await SecureStore.getItemAsync('access_token')
    return access_token
}

export async function GetRefreshToken(){
    let refresh_token = await SecureStore.getItemAsync('refresh_token')
    return refresh_token
}

export async function DeleteTokens(){
    await SecureStore.deleteItemAsync('access_token')
    await SecureStore.deleteItemAsync('refresh_token')
    delete axios.defaults.headers.common['Authorization']
}