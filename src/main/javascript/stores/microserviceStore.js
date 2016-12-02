import { createStore } from 'redux';

// private, initial (and 'immutable') state. its only mutated by the reducer function
const initialState = {
    microservices: [],
    consumers: [],
    selectedService: undefined
}

// reducer function, creates a new state object from the previous state and the action
function updateStore(state = initialState, action) {
    switch(action.type) {
        case 'ADD_RELATION':
            // TODO implement me
        case 'FETCH_CONSUMERS_SUCCESS': {
            const newState = Object.assign({}, state, {
                consumers: action.response.entity,
            });
            return newState;
        }
        case 'FETCH_MICROSERVICES_SUCCESS': {
            const newState = Object.assign({}, state, {
                microservices: action.response.entity,
            });
            return newState;
        }
        case 'MICROSERVICE_NODE_SELECTED': {
            const newState = Object.assign({}, state, {
                selectedService: action.selectedServiceId
            });
            return newState;
        }
        default:
            return state;
    }
}

// create & export redux store
export default createStore(updateStore);