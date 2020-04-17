import { combineReducers } from 'redux';
import game from './game';

const appReducer = combineReducers({
    game
});

const rootReducer = (state = {}, action) => {
    return appReducer(state, action);
};

export default rootReducer;
