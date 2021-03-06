import { ADD_TRANSACTION, DELETE_TRANSACTION, GET_TRANSACTIONS, UPDATE_TRANSACTION, UPDATE_TRANSACTION_AFTER_CATEGORY_CHANGE } from '../actions/actions';
const { DateTime } = require('luxon')

const initialState = {
    transactions: [],
    isTransactionsLoaded: false
}

const addItem = (array, data) => {
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
        DateTime.fromFormat(a.date, 'yyyy-MM-dd').toMillis() <
        DateTime.fromFormat(b.date, 'yyyy-MM-dd').toMillis() && 1 || -1
    )

    return array;
}

const deleteItem = (array, data) => {
    array.find(item => item.date == data.date).data =
        array.find(item => item.date == data.date).data.filter(d => d.id !== data.id);

    if (array.find(item => item.date == data.date).data.length === 0) {
        array = array.filter(item => item.date != data.date)
    }

    array.sort((a, b) =>
        DateTime.fromFormat(a.date, 'yyyy-MM-dd').toMillis() <
        DateTime.fromFormat(b.date, 'yyyy-MM-dd').toMillis() && 1 || -1
    )

    return array;
}

const updateItem = (array, data, oldDate) => {
    array = deleteItem(array, {
        ...data,
        date: oldDate
    })
    array = addItem(array, data)

    array.sort((a, b) =>
        DateTime.fromFormat(a.date, 'yyyy-MM-dd').toMillis() <
        DateTime.fromFormat(b.date, 'yyyy-MM-dd').toMillis() && 1 || -1
    )

    return array;
}

const updateCategory = (array, category, isTypeChanged) => {
    return array.map(i => ({
        ...i,
        data: i.data.map(tx => 
            tx = tx.category_id == category.id ? {
                ...tx,
                name: category.name,
                type: category.type,
                amount: isTypeChanged ? -tx.amount : tx.amount
            } : tx)
    }))
}

const categoriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TRANSACTION:
            return {
                ...state,
                transactions: addItem(state.transactions, action.payload),
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
                transactions: deleteItem(state.transactions, action.payload)
            };
        case UPDATE_TRANSACTION:
            return {
                ...state,
                transactions: updateItem(state.transactions, action.payload, action.payload.old_date)
            };
        case UPDATE_TRANSACTION_AFTER_CATEGORY_CHANGE:
            // state.transactions = updateCategory(state.transactions, action.payload, action.payload.isTypeChanged)
            return {
                ...state,
                // transactions: state.transactions.map(item => ({
                //     ...item,
                //     data: item.data.map(data => data.category_id == action.payload.id ? ({
                //         ...data,
                //         name: action.payload.name,
                //         type: action.payload.type,
                //         amount: action.payload.isTypeChanged ? -data.amount : data.amount
                //     }) : data)
                // }))
                transactions: updateCategory(state.transactions, action.payload, action.payload.isTypeChanged)
            }
        default:
            return state;
    }
}

export default categoriesReducer;