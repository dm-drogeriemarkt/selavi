import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";

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
    filterString: urlSearchParams.get('filter'),
    microserviceListResizeCount: 0,
    addEditDialogFormAction: undefined,
    debugMode: urlSearchParams.has('debug')
}

// reducer function, creates a new state object from the previous state and the action
export function updateStore(state = initialState, action) {
    switch (action.type) {
        case 'FETCH_MICROSERVICES_SUCCESS': {
            const stage = action.stage ? action.stage : state.stage;

            const newState = Object.assign({}, state, {
                microservices: action.response.entity,
                stage: stage,
                menuMode: undefined,
                entity: undefined,
                topComitters: undefined
            });
            return newState;
        }
        case 'FETCH_AVAILABLE_STAGES_SUCCESS': {
            var stage;
            var stageFromUrl = urlSearchParams.get('stage');
            
            if (action.response.entity.indexOf(stageFromUrl) != -1) {
                stage = stageFromUrl;
            } else if (action.response.entity.indexOf('dev') != -1) {
                stage = 'dev';
            } else {
                stage = action.response.entity[0];
            }

            const newState = Object.assign({}, state, {
                availableStages: action.response.entity,
                stage: stage
            });
            return newState;
        }
        case 'MICROSERVICE_NODE_SELECTED': {
            const newBitbucketDetails = Object.assign({}, state.bitbucketDetails);
            newBitbucketDetails[action.selectedServiceId] = action.response.entity;

            const newState = Object.assign({}, state, {
                selectedService: action.selectedServiceId,
                bitbucketDetails: newBitbucketDetails,
                topComitters: newBitbucketDetails[action.selectedServiceId]
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
            const relation = {
                target: action.consumedServiceId,
                label: 'Relation ' + action.consumerId + ' -> ' + action.consumedServiceId
            };

            const newState = Object.assign({}, state, {
                menuMode: 'ADD_RELATION',
                entity: relation,
                topComitters: undefined,
                addEditDialogFormAction: "/selavi/services/" + state.stage + "/" + action.consumerId + "/relations"
            });
            return newState;
        }
        case 'EDIT_SERVICE': {
            const newState = Object.assign({}, state, {
                entity: state.microservices.filter((microservice) => microservice.id === state.contextMenuServiceId)[0],
                topComitters: state.bitbucketDetails[state.contextMenuServiceId],
                contextMenuServiceId: undefined,
                menuMode: 'EDIT_SERVICE',
                addEditDialogFormAction: "/selavi/services/" + state.stage + "/" + state.contextMenuServiceId + "/properties"
            });
            return newState;
        }
        case 'SHOW_SERVICE': {
            const newState = Object.assign({}, state, {
                entity: state.microservices.filter((microservice) => microservice.id === state.contextMenuServiceId)[0],
                topComitters: state.bitbucketDetails[state.contextMenuServiceId],
                contextMenuServiceId: undefined,
                menuMode: 'SHOW_SERVICE'
            });
            return newState;
        }
        case 'ADD_EDIT_FAILED': {
            const newState = Object.assign({}, state, {
                menuMode: undefined,
                globalErrorMessage: action.message
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
            const relation = state.microservices
                .filter((microservice) => microservice.id === state.contextMenuFromId)[0].consumes
                .filter((relation) => relation.target === state.contextMenuToId)[0];
            relation.label = 'Relation ' + state.contextMenuFromId + ' -> ' + state.contextMenuToId;

            const newState = Object.assign({}, state, {
                entity: relation,
                topComitters: undefined,
                contextMenuFromId: undefined,
                contextMenuToId: undefined,
                menuMode: 'EDIT_RELATION',
                addEditDialogFormAction: "/selavi/services/" + state.stage + "/" + state.contextMenuFromId + "/relations/" + state.contextMenuToId
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
                addEditDialogFormAction: "/selavi/services/" + state.stage,
                entity: undefined,
                topComitters: undefined
            });
            return newState;
        }
        case 'CANCEL_MENU_ACTION': {
            const newState = Object.assign({}, state, {
                menuMode: undefined,
                addPropertyServiceId: undefined,
                deleteServiceErrorMessage: undefined,
                globalErrorMessage: undefined,
                entity: undefined,
                topComitters: undefined
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
        case 'LOGIN': {
            const newState = Object.assign({}, state, {
                menuMode: 'LOGIN',
                loginErrorMessage: undefined,
                loggedInUser: undefined
            });
            return newState;
        }
        case 'LOGIN_SUCCESS': {
            const newState = Object.assign({}, state, {
                menuMode: undefined,
                loginErrorMessage: undefined,
                loggedInUser: action.loggedInUser
            });
            return newState;
        }
        case 'LOGIN_FAILED': {
            const newState = Object.assign({}, state, {
                menuMode: 'LOGIN',
                loginErrorMessage: action.message,
                loggedInUser: undefined
            });
            return newState;
        }
        case 'LOGOUT_SUCCESS': {
            const newState = Object.assign({}, state, {
                loggedInUser: undefined,
                globalErrorMessage : undefined
            });
            return newState;
        }
        case 'LOGOUT_FAILED': {
            const newState = Object.assign({}, state, {
                globalErrorMessage: action.message
            });
            return newState;
        }
        default:
            return state;
    }
}

// create & export redux store
export default createStore(updateStore, applyMiddleware(thunk));
