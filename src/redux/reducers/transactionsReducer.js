import { ADD_TRANSACTIONS, GET_TRANSACTIONS } from '../actions/actions';

const initialState = {
    transactions: [],
    isTransactionsLoaded: false
}

function addData (array, data) {
    let dataSameDate = array.find(item => item.date == data.date);
    if (dataSameDate) {
        dataSameDate.data.push(data)
    } else {
        array.push({
            date: data.date,
            data: [data]
        })
    }

    return array;
}

function categoriesReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_TRANSACTIONS:
            return {
                ...state,
                transactions: addData(state.transactions, action.payload)
            }
        case GET_TRANSACTIONS:
            return {
                ...state,
                transactions: action.payload,
                isTransactionsLoaded: true
            };
        default:
            return state;
    }
}

export default categoriesReducer;