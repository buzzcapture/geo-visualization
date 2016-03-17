import React from "react";
import LeafletMap from "./leafletmap";
import _ from "lodash";

export default React.createClass({
    displayName: "ReactMapComponent",

    propTypes: {
        data: React.PropTypes.object,
        id: React.PropTypes.string,
        onZoom: React.PropTypes.func
    },

    getInitialState: function () {
      return {
          accuracy: 2
      }
    },

    shouldComponentUpdate: function () {
        return false;
    },

    componentDidMount: function() {
        this.map = LeafletMap.create(this.props.id);
        this.map.update(this.props.data);
        this.map.map.on("moveend", _.debounce(this.onUpdate, 1000))

    },

    componentWillUnmount: function() {
        this.map.destroy();
    },

    componentWillReceiveProps: function(nextProps){
        this.map.update(nextProps.data);
    },

    onUpdate: function(event){
        // You will call the function from this.props.{function} here.
        // Calculate the accuracy based on the zoom level and pass it to the api.
        // The response data should come in the form of new props. See componentWillReceiveProps
        var map = event.target;
        console.log(map.getZoom());
    },

    render: function () {
        return (<div ref="container" id={this.props.id}></div>)
    }
})