import { ADD_TRANSACTIONS, GET_TRANSACTIONS } from '../actions/actions';

const initialState = {
    transactions: []
}

function categoriesReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_TRANSACTIONS:
            let found = transactions.find(element => element.date === action.payload.date);
            if (found) {
                return {
                    ...state,
                    transactions: found.data.push(action.payload),
                };
            } else {
                return {
                    ...state,
                    transactions: [...state.transactions, action.payload],
                };
            }
        case GET_TRANSACTIONS:
            return {
                ...state,
                transactions: action.payload,
            };
        default:
            return state;
    }
}

export default categoriesReducer;