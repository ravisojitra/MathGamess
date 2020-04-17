import React, { Component, Fragment } from 'react';
import Routes from './src/routes';

console.disableYellowBox = true; //get rid of yellow box warnings

//REDUX SETUP
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import reducer from './src/reducers';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['game'],
    timeout: 0
};
const persistedReducer = persistReducer(persistConfig, reducer);
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(persistedReducer);
let persistor = persistStore(store);

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Routes />
                </PersistGate>
            </Provider>
        );
    }
}
