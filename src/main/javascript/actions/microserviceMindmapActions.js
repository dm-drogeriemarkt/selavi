const rest = require('rest');
const mime = require('rest/interceptor/mime');

export function onSelectMicroserviceNode(params) {
    return function (dispatch) {
        var client = rest.wrap(mime);
        client({
            path: '/selavi/bitbucket/' + params.stage + '/' + params.nodes[0],
            method: 'GET',
        }).then(response => {
            dispatch({
                type: 'MICROSERVICE_NODE_SELECTED',
                selectedServiceId: params.nodes[0],
                response: response
            });
        });
    }
}

export function onContextMenuOpen(params) {
    if (params.nodeId) {
        return {
            type: 'CONTEXT_MENU_OPEN',
            top: params.top,
            left: params.left,
            contextMenuServiceId: params.nodeId,
            contextMenuFromId: undefined,
            contextMenuToId: undefined
        };
    } else if (params.edgeFromId && params.edgeToId) {
        return {
            type: 'CONTEXT_MENU_OPEN',
            top: params.top,
            left: params.left,
            contextMenuServiceId: undefined,
            contextMenuFromId: params.edgeFromId,
            contextMenuToId: params.edgeToId
        };
    } else {
        return {
            type: 'CONTEXT_MENU_OPEN',
            top: -1,
            left: -1,
            contextMenuServiceId: undefined,
            contextMenuFromId: undefined,
            contextMenuToId: undefined
        };
    }
}

export function onAddLink(edgeData) {
    return function (dispatch) {
        dispatch({
            type: 'ADD_RELATION',
            consumerId: edgeData.from,
            consumedServiceId: edgeData.to
        });
    }
}
