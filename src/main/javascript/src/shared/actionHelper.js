export const actionCreator = (type, payload) => ({ type, payload });
export const actionFailed = (type, e) => ({ type, message: e.message });
