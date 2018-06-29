require('babel-register')();
const jsdom = require('jsdom').jsdom;
const reactTabEventPlugin = require('react-tap-event-plugin');

// setup jsdom
global.document = jsdom('<html><head><script></script></head><body></body></html>', {
  url: 'http://localhost'
});
global.window = document.defaultView;
global.navigator = window.navigator;

// react-tap-event-plugin must not be called twice
if (!global.touchTapSetup) {
  reactTabEventPlugin();
  global.touchTapSetup = true;
}

require('url-search-params-polyfill');
