import { GET_ACCOUNT, UPDATE_ACCOUNT } from '../actions/actions';

const initialState = {
    account: [],
    isAccountLoaded: false
}

function accountReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ACCOUNT:
            return {
                ...state,
                account: action.payload,
                isAccountLoaded: true
            };
        case UPDATE_ACCOUNT:
            return {
                ...state,
                account: action.payload
            }
        default:
            return state;
    }
}

export default accountReducer;