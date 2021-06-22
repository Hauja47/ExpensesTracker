import { ADD_CATEGORIES, DELETE_CATEGORIES, GET_CATEGORIES, UPDATE_CATEGORIES } from '../actions/actions';

const initialState = {
    categories: [],
    isCategoriesLoaded: false
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
                isCategoriesLoaded: true
            };
        case UPDATE_CATEGORIES:
            return {
                ...state,
                categories: state.categories.map(item => item.id === action.payload.id ? action.payload : item)
            }
        case DELETE_CATEGORIES:
            return {
                ...state,
                categories: state.categories.filter(item => item.id !== action.payload)
            }
        default:
            return state;
    }
}

export default categoriesReducer;