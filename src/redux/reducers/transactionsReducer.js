import { ADD_TRANSACTION, DELETE_TRANSACTION, GET_TRANSACTIONS, UPDATE_TRANSACTION } from '../actions/actions';
const { DateTime } = require('luxon')

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

    array.sort((a, b) =>
        DateTime.fromFormat('yyyy-MM-dd', a.date).toMillis() <
        DateTime.fromFormat('yyyy-MM-dd', b.date).toMillis() && 1 || -1)

    return array;
}

function deleteData(array, data) {
    array.find(item => item.date == data.date).data =
        array.find(item => item.date == data.date).data.filter(d => d.id !== data.id);

    if (array.find(item => item.date == data.date).data.length === 0) {
        array = array.filter(item => item.date != data.date)
    }

    array.sort((a, b) =>
        DateTime.fromFormat('yyyy-MM-dd', a.date).toMillis() <
        DateTime.fromFormat('yyyy-MM-dd', b.date).toMillis() && 1 || -1
    )

    return array;
}

function updateData(array, data, oldDate) {
    // data.find(item => item.id === 2).data = data.find(item => item.id === 2).data.map(item => {
    //     return (item.id === 5) ? { id: 5, data: 2 } : item
    // })

    if (oldDate === data.date) {
        array.find(item => item.date = oldDate).data = array.find(item => item.date = oldDate).data.map(item => {
            return (item.id === data.id) ? {
                id: data.id,
                name: data.name,
                date: data.date,
                amount: data.amount,
                description: data.description,
                type: data.type,
            } : item
        })
    } else {    
        array = deleteData(array, data)
        array = addData(array, data)
    }
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
        case UPDATE_TRANSACTION:
            return {
                ...state,
                transactions: updateData(state.transactions, action.payload, action.payload.old_date)
            };
        default:
            return state;
    }
}

export default categoriesReducer;