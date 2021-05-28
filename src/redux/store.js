import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import categoriesReducer from './reducers/categoriesReducer';
import transactionsReducer from './reducers/transactionsReducer';

const rootReducer = combineReducers({
    categoriesReducer,
    transactionsReducer,
})

export const store = createStore(rootReducer, applyMiddleware(thunk));