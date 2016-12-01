var msReq = new XMLHttpRequest();

msReq.open('GET', '../data/microservices.json', false);
msReq.send(null);

var microserviceJsonNodes = JSON.parse(msReq.response);
microserviceJsonNodes = microserviceJsonNodes.map(function (el) {
    el.color = "lightblue";
    return el;
});

var consumerReq = new XMLHttpRequest();
consumerReq.open('GET', '../data/consumers.json', false);
consumerReq.send(null);

var consumerJsonNodes = JSON.parse(consumerReq.response);
consumerJsonNodes = consumerJsonNodes.map(function (el) {
    el.color = "orange";
    return el;
});

var allNodes = microserviceJsonNodes.concat(consumerJsonNodes);

// create an array with nodes
var nodes = new vis.DataSet(allNodes);

var edgeArray = [];

allNodes.filter(function (el) {
    return el.consumes;
}).forEach(function (el) {
    el.consumes.forEach(function (consumer) {
        edgeArray.push({
            from: el.id,
            to: consumer
        });
    });
});

var edges = new vis.DataSet(edgeArray);

// create a network
var container = document.getElementById('vizcontainer');
var data = {
    nodes: nodes,
    edges: edges
};
var options = {
    nodes: {
        borderWidth: 2,
        shadow: true,
        font: {color: "white"}
    },
    edges: {
        width: 2,
        shadow: true
    }
};
var network = new vis.Network(container, data, options);

network.on("click", function (params) {
    var metadatacontainer = document.getElementById('metadatacontainer');
    metadatacontainer.innerHTML = allNodes.filter(function (el) {
        return el.id === params.nodes[0];
    }).map(function (el) {
        return JSON.stringify(el.metadata);
    })[0];
});