import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

export const urlSearchParams = new URLSearchParams(document.location.search.substring(1));

// private, initial (and 'immutable') state. its only mutated by the reducer function
const initialState = {
  stage: '',
  availableStages: [],
  microservices: [],
  bitbucketDetails: {},
  topComitters: [],
  selectedService: '',
  contextMenuTop: -1,
  contextMenuLeft: -1,
  contextMenuServiceId: -1,
  contextMenuFromId: -1,
  contextMenuToId: -1,
  addPropertyServiceId: 'NONE',
  deleteServiceId: 'NONE',
  deleteServiceErrorMessage: '',
  contextMenuVisible: false,
  menuMode: '',
  filterString: urlSearchParams.get('filter') || '',
  microserviceListResizeCount: 0,
  addEditDialogFormAction: null,
  globalErrorMessage: '',
  loginErrorMessage: '',
  deleteLinkToId: 'NONE',
  deleteLinkFromId: 'NONE',
  loggedInUser: {},
  debugMode: urlSearchParams.has('debug')
};

// reducer function, creates a new state object from the previous state and the action
export function updateStore(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_MICROSERVICES_SUCCESS': {
      const stage = action.stage ? action.stage : state.stage;

      return Object.assign({}, state, {
        microservices: action.response.entity,
        stage,
        menuMode: '',
        entity: undefined,
        topComitters: []
      });
    }
    case 'FETCH_AVAILABLE_STAGES_SUCCESS': {
      let stage;
      const stageFromUrl = urlSearchParams.get('stage');

      if (action.response.entity.indexOf(stageFromUrl) !== -1) {
        stage = stageFromUrl;
      } else if (action.response.entity.indexOf('dev') !== -1) {
        stage = 'dev';
      } else {
        stage = action.response.entity[0];
      }

      return Object.assign({}, state, {
        availableStages: action.response.entity,
        stage
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
        contextMenuToId: action.contextMenuToId
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
        label: `Relation ${action.consumerId} -> ${action.consumedServiceId}`
      };

      return Object.assign({}, state, {
        menuMode: 'ADD_RELATION',
        entity: relation,
        topComitters: '',
        addEditDialogFormAction: `/selavi/services/${state.stage}/${action.consumerId}/relations`
      });
    }
    case 'EDIT_SERVICE': {
      return Object.assign({}, state, {
        entity: state.microservices.filter((microservice) => microservice.id === state.contextMenuServiceId)[0],
        topComitters: state.bitbucketDetails[state.contextMenuServiceId],
        contextMenuServiceId: '',
        menuMode: 'EDIT_SERVICE',
        addEditDialogFormAction: `/selavi/services/${state.stage}/${state.contextMenuServiceId}/properties`
      });
    }
    case 'SHOW_SERVICE': {
      return Object.assign({}, state, {
        entity: state.microservices.filter((microservice) => microservice.id === state.contextMenuServiceId)[0],
        topComitters: state.bitbucketDetails[state.contextMenuServiceId],
        contextMenuServiceId: '',
        menuMode: 'SHOW_SERVICE'
      });
    }
    case 'ADD_EDIT_FAILED': {
      return Object.assign({}, state, {
        menuMode: '',
        globalErrorMessage: action.message
      });
    }
    case 'DELETE_SERVICE': {
      return Object.assign({}, state, {
        deleteServiceId: state.contextMenuServiceId,
        contextMenuServiceId: '',
        menuMode: 'DELETE_SERVICE'
      });
    }
    case 'DELETE_LINK': {
      return Object.assign({}, state, {
        deleteLinkFromId: state.contextMenuFromId,
        deleteLinkToId: state.contextMenuToId,
        contextMenuFromId: -1,
        contextMenuToId: -1,
        menuMode: 'DELETE_LINK'
      });
    }
    case 'EDIT_LINK': {
      const relation = state.microservices.filter((microservice) => microservice.id === state.contextMenuFromId)[0].consumes.filter(() => relation.target === state.contextMenuToId)[0];
      relation.label = `Relation ${state.contextMenuFromId} -> ${state.contextMenuToId}`;

      return Object.assign({}, state, {
        entity: relation,
        topComitters: [],
        contextMenuFromId: -1,
        contextMenuToId: -1,
        menuMode: 'EDIT_RELATION',
        addEditDialogFormAction: `/selavi/services/${state.stage}/${state.contextMenuFromId}/relations/${state.contextMenuToId}`
      });
    }
    case 'DELETE_SERVICE_FAILED': {
      return Object.assign({}, state, {
        deleteServiceErrorMessage: action.message
      });
    }
    case 'ADD_LINK_SET_CONSUMED_SERVICE': {
      // TODO: can we just fetch all the services from the backend again instead of merging here?
      const consumedServiceIndex = state.microservices.findIndex((node) => node.id === action.consumerId);

      const newConsumingMicroservice = Object.assign({}, state.microservices[consumedServiceIndex]);
      if (!newConsumingMicroservice.consumes) {
        newConsumingMicroservice.consumes = [];
      }
      newConsumingMicroservice.consumes.push(action.consumedServiceId);

      const newMicroservices = state.microservices.slice();
      newMicroservices[consumedServiceIndex] = newConsumingMicroservice;

      return Object.assign({}, state, {
        microservices: newMicroservices,
        menuMode: ''
      });
    }
    case 'ADD_SERVICE': {
      return Object.assign({}, state, {
        menuMode: 'ADD_SERVICE',
        addEditDialogFormAction: `/selavi/services/${state.stage}`,
        entity: '',
        topComitters: []
      });
    }
    case 'CANCEL_MENU_ACTION': {
      return Object.assign({}, state, {
        menuMode: '',
        addPropertyServiceId: 'NONE',
        deleteServiceErrorMessage: '',
        globalErrorMessage: '',
        entity: '',
        topComitters: []
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
        loginErrorMessage: '',
        loggedInUser: {}
      });
    }
    case 'LOGIN_SUCCESS': {
      return Object.assign({}, state, {
        menuMode: '',
        loginErrorMessage: '',
        loggedInUser: action.loggedInUser
      });
    }
    case 'LOGIN_FAILED': {
      return Object.assign({}, state, {
        menuMode: 'LOGIN',
        loginErrorMessage: action.message,
        loggedInUser: {}
      });
    }
    case 'LOGOUT_SUCCESS': {
      return Object.assign({}, state, {
        loggedInUser: {},
        globalErrorMessage: ''
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
