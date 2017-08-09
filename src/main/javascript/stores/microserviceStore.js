import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

// TODO: is this a good place to handle url search params?
const urlSearchParams = new URLSearchParams(document.location.search.substring(1));

// private, initial (and 'immutable') state. its only mutated by the reducer function
const initialState = {
    stage: undefined,
    availableStages: [],
    microservices: [],
    bitbucketDetails: {},
    topComitters: undefined,
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
    filterString: urlSearchParams.get('filter') || '',
    microserviceListResizeCount: 0,
    addEditDialogFormAction: undefined,
    debugMode: urlSearchParams.has('debug')
};

// reducer function, creates a new state object from the previous state and the action
export function updateStore(state = initialState, action) {
    switch (action.type) {
        case 'FETCH_MICROSERVICES_SUCCESS': {
            const stage = action.stage ? action.stage : state.stage;

            return Object.assign({}, state, {
                microservices: action.response.entity,
                stage: stage,
                menuMode: undefined,
                entity: undefined,
                topComitters: undefined
            });
        }
        case 'FETCH_AVAILABLE_STAGES_SUCCESS': {
            let stage;
            let stageFromUrl = urlSearchParams.get('stage');

            if (action.response.entity.indexOf(stageFromUrl) !== -1) {
                stage = stageFromUrl;
            } else if (action.response.entity.indexOf('dev') !== -1) {
                stage = 'dev';
            } else {
                stage = action.response.entity[0];
            }

            return Object.assign({}, state, {
                availableStages: action.response.entity,
                stage: stage
            });
        }
        case 'MICROSERVICE_NODE_SELECTED': {
            const newBitbucketDetails = Object.assign({}, state.bitbucketDetails);
            newBitbucketDetails[action.selectedServiceId] = action.response.entity;

            return Object.assign({}, state, {
                selectedService: action.selectedServiceId,
                bitbucketDetails: newBitbucketDetails,
                topComitters: newBitbucketDetails[action.selectedServiceId]
            });
        }
        case 'CONTEXT_MENU_OPEN': {
            return Object.assign({}, state, {
                contextMenuTop: action.top,
                contextMenuLeft: action.left,
                contextMenuServiceId: action.contextMenuServiceId,
                contextMenuFromId: action.contextMenuFromId,
                contextMenuToId: action.contextMenuToId,
            });
        }
        case 'ADD_LINK': {
            return Object.assign({}, state, {
                menuMode: 'ADD_LINK'
            });
        }
        case 'ADD_RELATION': {
            const relation = {
                target: action.consumedServiceId,
                label: 'Relation ' + action.consumerId + ' -> ' + action.consumedServiceId
            };

            return Object.assign({}, state, {
                menuMode: 'ADD_RELATION',
                entity: relation,
                topComitters: undefined,
                addEditDialogFormAction: "/selavi/services/" + state.stage + "/" + action.consumerId + "/relations"
            });
        }
        case 'EDIT_SERVICE': {
            return Object.assign({}, state, {
                entity: state.microservices.filter((microservice) => microservice.id === state.contextMenuServiceId)[0],
                topComitters: state.bitbucketDetails[state.contextMenuServiceId],
                contextMenuServiceId: undefined,
                menuMode: 'EDIT_SERVICE',
                addEditDialogFormAction: "/selavi/services/" + state.stage + "/" + state.contextMenuServiceId + "/properties"
            });
        }
        case 'SHOW_SERVICE': {
            return Object.assign({}, state, {
                entity: state.microservices.filter((microservice) => microservice.id === state.contextMenuServiceId)[0],
                topComitters: state.bitbucketDetails[state.contextMenuServiceId],
                contextMenuServiceId: undefined,
                menuMode: 'SHOW_SERVICE'
            });
        }
        case 'ADD_EDIT_FAILED': {
            return Object.assign({}, state, {
                menuMode: undefined,
                globalErrorMessage: action.message
            });
        }
        case 'DELETE_SERVICE': {
            return Object.assign({}, state, {
                deleteServiceId: state.contextMenuServiceId,
                contextMenuServiceId: undefined,
                menuMode: 'DELETE_SERVICE'
            });
        }
        case 'DELETE_LINK': {
            return Object.assign({}, state, {
                deleteLinkFromId: state.contextMenuFromId,
                deleteLinkToId: state.contextMenuToId,
                contextMenuFromId: undefined,
                contextMenuToId: undefined,
                menuMode: 'DELETE_LINK'
            });
        }
        case 'EDIT_LINK': {
            const relation = state.microservices
                                  .filter((microservice) => microservice.id === state.contextMenuFromId)[0].consumes
                                                                                                           .filter((relation) => relation.target === state.contextMenuToId)[0];
            relation.label = 'Relation ' + state.contextMenuFromId + ' -> ' + state.contextMenuToId;

            return Object.assign({}, state, {
                entity: relation,
                topComitters: undefined,
                contextMenuFromId: undefined,
                contextMenuToId: undefined,
                menuMode: 'EDIT_RELATION',
                addEditDialogFormAction: "/selavi/services/" + state.stage + "/" + state.contextMenuFromId + "/relations/" + state.contextMenuToId
            });
        }
        case 'DELETE_SERVICE_FAILED': {
            return Object.assign({}, state, {
                deleteServiceErrorMessage: action.message
            });
        }
        case 'ADD_LINK_SET_CONSUMED_SERVICE': {
            // TODO: can we just fetch all the services from the backend again instead of merging here?
            let consumedServiceIndex = state.microservices.findIndex((node) => node.id === action.consumerId);

            const newConsumingMicroservice = Object.assign({}, state.microservices[consumedServiceIndex]);
            if (!newConsumingMicroservice.consumes) {
                newConsumingMicroservice.consumes = []
            }
            newConsumingMicroservice.consumes.push(action.consumedServiceId);

            const newMicroservices = state.microservices.slice();
            newMicroservices[consumedServiceIndex] = newConsumingMicroservice;

            return Object.assign({}, state, {
                microservices: newMicroservices,
                menuMode: undefined
            });
        }
        case 'ADD_SERVICE': {
            return Object.assign({}, state, {
                menuMode: 'ADD_SERVICE',
                addEditDialogFormAction: "/selavi/services/" + state.stage,
                entity: undefined,
                topComitters: undefined
            });
        }
        case 'CANCEL_MENU_ACTION': {
            return Object.assign({}, state, {
                menuMode: undefined,
                addPropertyServiceId: undefined,
                deleteServiceErrorMessage: undefined,
                globalErrorMessage: undefined,
                entity: undefined,
                topComitters: undefined
            });
        }
        case 'FILTERBOX_TYPE': {
            return Object.assign({}, state, {
                filterString: action.filterString
            });
        }
        case 'MICROSERVICE_LIST_RESIZE': {
            return Object.assign({}, state, {
                microserviceListResizeCount: ((state.microserviceListResizeCount + 1) % 1000)
            });
        }
        case 'LOGIN': {
            return Object.assign({}, state, {
                menuMode: 'LOGIN',
                loginErrorMessage: undefined,
                loggedInUser: undefined
            });
        }
        case 'LOGIN_SUCCESS': {
            return Object.assign({}, state, {
                menuMode: undefined,
                loginErrorMessage: undefined,
                loggedInUser: action.loggedInUser
            });
        }
        case 'LOGIN_FAILED': {
            return Object.assign({}, state, {
                menuMode: 'LOGIN',
                loginErrorMessage: action.message,
                loggedInUser: undefined
            });
        }
        case 'LOGOUT_SUCCESS': {
            return Object.assign({}, state, {
                loggedInUser: undefined,
                globalErrorMessage: undefined
            });
        }
        case 'LOGOUT_FAILED': {
            return Object.assign({}, state, {
                globalErrorMessage: action.message
            });
        }
        default:
            return state;
    }
}

// create & export redux store
export default createStore(updateStore, applyMiddleware(thunk));
