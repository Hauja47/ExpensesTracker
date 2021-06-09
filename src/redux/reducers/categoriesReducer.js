import { ADD_CATEGORIES, GET_CATEGORIES } from '../actions/actions';

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
        default:
            return state;
    }
}

export default categoriesReducer;