const rest = require('rest');
const mime = require('rest/interceptor/mime');

export function onSelectMicroserviceNode(params) {
    return {
        type: 'MICROSERVICE_NODE_SELECTED',
        selectedServiceId: params.nodes[0]
    };
}

export function onContextMenuOpen(params, nodeId) {
    if (nodeId) {
        return {
            type: 'CONTEXT_MENU_OPEN',
            top: params.pointer.DOM.y,
            left: params.pointer.DOM.x,
            contextMenuServiceId: nodeId
        };
    } else {
        return {
            type: 'CONTEXT_MENU_OPEN',
            top: -1,
            left: -1,
            contextMenuServiceId: undefined
        };
    }
}

export function onAddLink(edgeData) {
    return function (dispatch) {
        var client = rest.wrap(mime);
        client({
            path: '/services/' + edgeData.from + '/relation',
            method: 'PUT',
            entity: edgeData.to
        }).then(response => {
            dispatch({
                type: 'ADD_LINK_SET_CONSUMED_SERVICE',
                consumerId: edgeData.from,
                consumedServiceId: edgeData.to
            });
        });
    }
}