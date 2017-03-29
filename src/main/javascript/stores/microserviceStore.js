import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// private, initial (and 'immutable') state. its only mutated by the reducer function
const initialState = {
    microservices: [],
    selectedService: undefined,
    contextMenuTop: -1,
    contextMenuLeft: -1,
    contextMenuServiceId: undefined,
    contextMenuFromId: undefined,
    contextMenuToId: undefined,
    addPropertyServiceId: undefined,
    deleteServiceId: undefined,
    deleteServiceErrorMessage: undefined,
    contextMenuVisible: false,
    menuMode: undefined,
    filterString: '',
    microserviceListResizeCount: 0,
    addEditDialogFormAction: undefined,
    // TODO: either remove this when its not needed anymore, or maybe use react-router to handle url
    debugMode: (document.location.search === '?debug')
}

// reducer function, creates a new state object from the previous state and the action
function updateStore(state = initialState, action) {
    switch(action.type) {
        case 'FETCH_MICROSERVICES_SUCCESS': {
            const newState = Object.assign({}, state, {
                microservices: action.response.entity,
                menuMode: undefined,
                entity: undefined
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
                contextMenuServiceId: action.contextMenuServiceId,
                contextMenuFromId: action.contextMenuFromId,
                contextMenuToId: action.contextMenuToId,
            });
            return newState;
        }
        case 'ADD_LINK': {
            const newState = Object.assign({}, state, {
                menuMode: 'ADD_LINK'
            });
            return newState;
        }
        case 'ADD_RELATION': {
            const newState = Object.assign({}, state, {
                menuMode: 'ADD_RELATION',
                entity: {"target": action.consumedServiceId},
                addEditDialogFormAction: "/selavi/services/" + action.consumerId + "/relations"
            });
            return newState;
        }
        case 'EDIT_SERVICE': {
            const newState = Object.assign({}, state, {
                entity: state.microservices.filter((microservice) => microservice.id === state.contextMenuServiceId)[0],
                contextMenuServiceId: undefined,
                menuMode: 'EDIT_SERVICE',
                addEditDialogFormAction: "/selavi/services/" + state.contextMenuServiceId + "/properties"
            });
            return newState;
        }
        case 'DELETE_SERVICE': {
            const newState = Object.assign({}, state, {
                deleteServiceId: state.contextMenuServiceId,
                contextMenuServiceId: undefined,
                menuMode: 'DELETE_SERVICE'
            });
            return newState;
        }
        case 'DELETE_LINK': {
            const newState = Object.assign({}, state, {
                deleteLinkFromId: state.contextMenuFromId,
                deleteLinkToId: state.contextMenuToId,
                contextMenuFromId: undefined,
                contextMenuToId: undefined,
                menuMode: 'DELETE_LINK'
            });
            return newState;
        }
        case 'EDIT_LINK': {
            const newState = Object.assign({}, state, {
                entity: state.microservices
                    .filter((microservice) => microservice.id === state.contextMenuFromId)[0].consumes
                    .filter((relation) => relation.target === state.contextMenuToId)[0],
                contextMenuFromId: undefined,
                contextMenuToId: undefined,
                menuMode: 'EDIT_RELATION',
                addEditDialogFormAction: "/selavi/services/" + state.contextMenuFromId + "/relations/" + state.contextMenuToId
            });
            return newState;
        }
        case 'DELETE_SERVICE_FAILED': {
            const newState = Object.assign({}, state, {
                deleteServiceErrorMessage: action.message
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
                menuMode: 'ADD_SERVICE',
                addEditDialogFormAction: "/selavi/services"
            });
            return newState;
        }
        case 'CANCEL_MENU_ACTION': {
            const newState = Object.assign({}, state, {
                menuMode: undefined,
                addPropertyServiceId: undefined,
                deleteServiceErrorMessage: undefined
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