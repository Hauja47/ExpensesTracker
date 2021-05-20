import { ADD_CATEGORIES, GET_CATEGORIES } from '../actions/actions';

const initialState = {
    categories: []
}

function categoriesReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_CATEGORIES:
            return {
                ...state,
                categories: [...state.categories, action.payload],
            };
        case GET_CATEGORIES:
            return {
                ...state,
                categories: action.payload,
            };
        default:
            return state;
    }
}

export default categoriesReducer;