import { createStore } from 'redux';

// private, initial (and 'immutable') state. its only mutated by the reducer function
const initialState = {
    microservices: [],
    consumers: []
}

// reducer function, creates a new state object from the previous state and the action
function updateStore(state = initialState, action) {
    switch(action.type) {
        case 'ADD_RELATION':
            // TODO implement me
        case 'FETCH_CONSUMERS_SUCCESS': {
            const newState = Object.assign({}, state, {
                microservices: state.microservices,
                consumers: action.response.entity
            });
            return newState;
        }
        case 'FETCH_MICROSERVICES_SUCCESS': {
            const newState = Object.assign({}, state, {
                microservices: action.response.entity,
                consumers: state.consumers
            });
            return newState;
        }
        default:
            return state;
    }
}

// create & export redux store
export default createStore(updateStore);