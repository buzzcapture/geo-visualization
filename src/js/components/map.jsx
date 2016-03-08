import React from "react";
import LeafletMap from "./leafletmap";

export default React.createClass({
    displayName: "ReactMapComponent",

    propTypes: {
        data: React.PropTypes.object,
        id: React.PropTypes.string
    },

    shouldComponentUpdate: function () {
        return false;
    },

    componentDidMount: function() {
        this.map = LeafletMap.create(this.props.id);
        this.map.update(this.props.data);
    },

    componentWillUnmount: function() {
        this.map.destroy();
    },

    componentWillReceiveProps: function(nextProps){
        this.map.update(nextProps.data);
    },

    render: function () {
        return (<div ref="container" id={this.props.id}></div>)
    }
})