import { combineReducers } from 'redux';
import { user } from './user';
import { users } from './users';
// import { token } from './token';

const rootReducer = combineReducers({
    userState: user,
    usersState: users,
}) 

export default rootReducer