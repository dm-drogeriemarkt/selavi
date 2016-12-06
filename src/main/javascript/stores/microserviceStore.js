import { createStore } from 'redux';

// private, initial (and 'immutable') state. its only mutated by the reducer function
const initialState = {
    microservices: [],
    consumers: [],
    selectedService: undefined,
    contextMenuTop: -1,
    contextMenuLeft: -1,
    contextMenuServiceId: undefined,
    addLinkConsumerId: undefined
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
                addLinkConsumerId: state.contextMenuServiceId,
                contextMenuServiceId: undefined
            });
            return newState;
        }
        case 'ADD_LINK_SET_CONSUMED_SERVICE': {

            var newState;

            var consumedServiceIndex = state.consumers.findIndex((node) => node.id === state.addLinkConsumerId);

            // TODO: doppelter code fliegt weg, sobald alle services von einer resource ausgeliefert werden
            if (consumedServiceIndex != -1) {
                const newConsumer = Object.assign({}, state.consumers[consumedServiceIndex]);
                newConsumer.consumes.push(action.consumedServiceId);

                const newConsumers = state.consumers.slice();
                newConsumers[consumedServiceIndex] = newConsumer;

                newState = Object.assign({}, state, {
                    consumers: newConsumers,
                    addLinkConsumerId: undefined
                });
            } else {
                consumedServiceIndex = state.microservices.findIndex((node) => node.id === state.addLinkConsumerId);

                const newConsumingMicroservice = Object.assign({}, state.microservices[consumedServiceIndex]);
                if (!newConsumingMicroservice.consumes) {
                    newConsumingMicroservice.consumes = []
                }
                newConsumingMicroservice.consumes.push(action.consumedServiceId);

                const newMicroservices = state.microservices.slice();
                newMicroservices[consumedServiceIndex] = newConsumingMicroservice;

                newState = Object.assign({}, state, {
                    microservices: newMicroservices,
                    addLinkConsumerId: undefined
                });
            }

            return newState;
        }
        default:
            return state;
    }
}

// create & export redux store
export default createStore(updateStore);