const React = require('react');

export default class MicroserviceMindmap extends React.Component {

    componentWillReceiveProps(nextProps) {
        var microservices = nextProps.microservices.map(microservice => {
            microservice.color = "lightblue";
            return microservice;
        });

        var consumers = nextProps.consumers.map(consumer => {
            consumer.color = "orange";
            return consumer;
        });

        var allNodes = microservices.concat(consumers);

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

        var network = new vis.Network(this.refs.vizcontainer, data, options);
    }

    render() {
        return <div ref="vizcontainer"></div>;
    }
}