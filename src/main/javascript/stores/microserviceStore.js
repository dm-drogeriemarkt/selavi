import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// private, initial (and 'immutable') state. its only mutated by the reducer function
const initialState = {
    microservices: [],
    selectedService: undefined,
    contextMenuTop: -1,
    contextMenuLeft: -1,
    contextMenuServiceId: undefined,
    addPropertyServiceId: undefined,
    contextMenuVisible: false,
    menuMode: undefined,
    filterString: '',
    microserviceListResizeCount: 0
}

// reducer function, creates a new state object from the previous state and the action
function updateStore(state = initialState, action) {
    switch(action.type) {
        case 'FETCH_MICROSERVICES_SUCCESS': {
            const newState = Object.assign({}, state, {
                microservices: action.response.entity,
                menuMode: undefined
            });
            return newState;
        }
        case 'MICROSERVICE_NODE_SELECTED': {
            const newState = Object.assign({}, state, {
                selectedService: action.selectedServiceId
            });
            return newState;
        }
        case 'CONTEXT_MENU_OPEN': {
            const newState = Object.assign({}, state, {
                contextMenuTop: action.top,
                contextMenuLeft: action.left,
                contextMenuServiceId: action.contextMenuServiceId
            });
            return newState;
        }
        case 'ADD_LINK': {
            const newState = Object.assign({}, state, {
                menuMode: 'ADD_LINK'
            });
            return newState;
        }
        case 'EDIT_SERVICE': {
            const newState = Object.assign({}, state, {
                addPropertyServiceId: state.contextMenuServiceId,
                contextMenuServiceId: undefined,
                menuMode: 'EDIT_SERVICE'
            });
            return newState;
        }
        case 'ADD_LINK_SET_CONSUMED_SERVICE': {
            // TODO: can we just fetch all the services from the backend again instead of merging here?
            var consumedServiceIndex = state.microservices.findIndex((node) => node.id === action.consumerId);

            const newConsumingMicroservice = Object.assign({}, state.microservices[consumedServiceIndex]);
            if (!newConsumingMicroservice.consumes) {
                newConsumingMicroservice.consumes = []
            }
            newConsumingMicroservice.consumes.push(action.consumedServiceId);

            const newMicroservices = state.microservices.slice();
            newMicroservices[consumedServiceIndex] = newConsumingMicroservice;

            const newState = Object.assign({}, state, {
                microservices: newMicroservices,
                menuMode: undefined
            });

            return newState;
        }
        case 'ADD_SERVICE': {
            const newState = Object.assign({}, state, {
                menuMode: 'ADD_SERVICE'
            });
            return newState;
        }
        case 'CANCEL_MENU_ACTION': {
            const newState = Object.assign({}, state, {
                menuMode: undefined,
                addPropertyServiceId: undefined
            });
            return newState;
        }
        case 'FILTERBOX_TYPE': {
            const newState = Object.assign({}, state, {
                filterString: action.filterString
            });
            return newState;
        }
        case 'MICROSERVICE_LIST_RESIZE': {
            const newState = Object.assign({}, state, {
                microserviceListResizeCount: ((state.microserviceListResizeCount + 1) % 1000)
            });
            return newState;
        }
        default:
            return state;
    }
}

// create & export redux store
export default createStore(updateStore, applyMiddleware(thunk));