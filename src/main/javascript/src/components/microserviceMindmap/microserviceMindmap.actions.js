import rest from 'rest';
import mime from 'rest/interceptor/mime';

export function onSelectMicroserviceNode(params) {
  return (dispatch) => {
    const client = rest.wrap(mime);
    client({
      path: `/selavi/bitbucket/${params.stage}/${params.nodes[0]}`,
      method: 'GET'
    })
      .then(response => {
        dispatch({
          type: 'MICROSERVICE_NODE_SELECTED',
          selectedServiceId: params.nodes[0],
          response
        });
      });
  };
}

export function onContextMenuOpen(params) {
  if (params.nodeId) {
    return {
      type: 'CONTEXT_MENU_OPEN',
      top: params.top,
      left: params.left,
      contextMenuServiceId: params.nodeId,
      contextMenuFromId: -1,
      contextMenuToId: -1
    };
  } if (params.edgeFromId && params.edgeToId) {
    return {
      type: 'CONTEXT_MENU_OPEN',
      top: params.top,
      left: params.left,
      contextMenuServiceId: -1,
      contextMenuFromId: params.edgeFromId,
      contextMenuToId: params.edgeToId
    };
  }
  return {
    type: 'CONTEXT_MENU_OPEN',
    top: -1,
    left: -1,
    contextMenuServiceId: -1,
    contextMenuFromId: -1,
    contextMenuToId: -1
  };
}

export function onAddLink(edgeData) {
  return (dispatch) => {
    dispatch({
      type: 'ADD_RELATION',
      consumerId: edgeData.from,
      consumedServiceId: edgeData.to
    });
  };
}
