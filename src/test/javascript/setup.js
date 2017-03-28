//require('babel-register')();
var jsdom = require('jsdom').jsdom;

// setup jsdom
global.document = jsdom('<html><head><script></script></head><body></body></html>');
global.window = document.defaultView;
global.navigator = window.navigator;

//delete global.window.location;
// global.window.location = {
//     hash: "",
//     host: "localhost:8080",
//     hostname: "localhost",
//     href: "http://localhost:8080/",
//     origin: "http://localhost:8080",
//     pathname: "/",
//     port: "8080",
//     protocol: "http:",
//     search: ''
// };

// global.window = document.defaultView;
// Object.keys(document.defaultView).forEach((property) => {
//     if (typeof global[property] === 'undefined') {
//         global[property] = document.defaultView[property];
//     }
// });
//
// global.navigator = {
//     userAgent: 'node.js'
// };

//delete global.window.location;