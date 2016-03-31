import React from "react";
import LeafletMap from "./leafletmap";
import _ from "lodash";

export default React.createClass({
    displayName: "GeoVisualizationReactComponent",

    propTypes: {
        data: React.PropTypes.object,
        id: React.PropTypes.string,
        onZoom: React.PropTypes.func
    },

    getInitialState: function () {
      return {
          accuracy: 6 //
      }
    },

    shouldComponentUpdate: function () {
        return false;
    },

    componentDidMount: function() {
        this.map = LeafletMap.create(this.props.id);
        this.map.update(this.props.data);
        this.map.map.on("moveend", _.debounce(this.onUpdate, 1000))
        this.setAccuracy(this.map.map.getZoom());

    },

    componentWillUnmount: function() {
        this.map.destroy();
    },

    componentWillReceiveProps: function(nextProps){
        this.map.update(nextProps.data);
    },

    setAccuracy: function(zoom){
        var accuracy;
        if(zoom <= 7) {
            accuracy = 3
        } else if(zoom <= 9) {
            accuracy = 4
        } else if( zoom <= 12) {
            accuracy = 5
        } else if (zoom <= 13) {
            accuracy = 6
        } else {
            accuracy = 6
        }

        this.setState({
            accuracy: accuracy
        })
    },

    onUpdate: function(event){
        // You will call the function from this.props.{function} here.
        // Calculate the accuracy based on the zoom level and pass it to the api.
        // The response data should come in the form of new props. See componentWillReceiveProps
        this.setAccuracy(this.map.map.getZoom());
        console.log(this.state.accuracy);
    },

    render: function () {
        return (<div ref="container" id={this.props.id} className="geo-visualization-chart"></div>)
    }
})