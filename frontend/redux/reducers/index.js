import { combineReducers } from 'redux';
import { user } from './user';
import { users } from './users';
import { token } from './token';

const rootReducer = combineReducers({
    tokenState: token,
    userState: user,
    usersState: users,
}) 

export default rootReducer