const React = require('react');
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        microservices: state.microservices,
        consumers: state.consumers
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSelectMicroserviceNode: (params) => {
            dispatch({
                type: 'MICROSERVICE_NODE_SELECTED',
                selectedServiceId: params.nodes[0]
            });
        }
    };
};

class MicroserviceMindmap extends React.Component {

    componentWillReceiveProps(nextProps) {
        this.setState({microservices: nextProps.microservices,
                       consumers: nextProps.consumers});
    }

    componentDidUpdate() {
        this.updateMindmap();
    }

    updateMindmap() {
        var microservices = this.state.microservices.map(microservice => {
            microservice.color = "lightblue";
            return microservice;
        });

        var consumers = this.state.consumers.map(consumer => {
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

        network.on("selectNode", this.props.onSelectMicroserviceNode);
    }

    render() {
        return <div className="microserviceMindmap" ref="vizcontainer"></div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MicroserviceMindmap);