var jsdom = require('jsdom').jsdom;

// setup jsdom
global.document = jsdom('<html><head><script></script></head><body></body></html>', {
    url: "http://localhost"
});
global.window = document.defaultView;
global.navigator = window.navigator;
