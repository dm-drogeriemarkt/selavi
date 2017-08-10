require('babel-register')();
const jsdom = require('jsdom').jsdom;

// setup jsdom
global.document = jsdom('<html><head><script></script></head><body></body></html>', {
    url: "http://localhost"
});
global.window = document.defaultView;
global.navigator = window.navigator;

// react-tap-event-plugin must not be called twice
if (!global.touchTapSetup) {
    require('react-tap-event-plugin')();
    global.touchTapSetup = true;
}

require('url-search-params-polyfill');
