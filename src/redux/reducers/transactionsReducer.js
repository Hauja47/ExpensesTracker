import { ADD_TRANSACTION, DELETE_TRANSACTION, GET_TRANSACTIONS } from '../actions/actions';

const initialState = {
    transactions: [],
    isTransactionsLoaded: false
}

function addData(array, data) {
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

function deleteData(array, data) {
    array.find(item => item.date == data.date).data = 
        array.find(item => item.date == data.date).data.filter(d => d.id !== data.id);
        
    console.log(array.find(item => item.date == data.date).data)
    if (array.find(item => item.date == data.date).data.length === 0) {
        array = array.filter(item => item.date != data.date)
    }

    return array;
}

function categoriesReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_TRANSACTION:
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
        case DELETE_TRANSACTION:
            return {
                ...state,
                transactions: deleteData(state.transactions, action.payload)
            };
        default:
            return state;
    }
}

export default categoriesReducer;