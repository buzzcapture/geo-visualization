"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Map = undefined;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _leafletmap = require("./leafletmap");

var _leafletmap2 = _interopRequireDefault(_leafletmap);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Map = exports.Map = _react2.default.createClass({
    displayName: "GeoVisualizationReactComponent",

    propTypes: {
        data: _react2.default.PropTypes.object,
        id: _react2.default.PropTypes.string,
        onZoom: _react2.default.PropTypes.func
    },

    getInitialState: function getInitialState() {
        return {
            accuracy: 6 //
        };
    },

    shouldComponentUpdate: function shouldComponentUpdate() {
        return false;
    },

    componentDidMount: function componentDidMount() {
        this.map = _leafletmap2.default.create(this.props.id);
        this.map.update(this.props.data);
        this.map.map.on("moveend", _lodash2.default.debounce(this.onUpdate, 1000));
        this.setAccuracy(this.map.map.getZoom());
    },

    componentWillUnmount: function componentWillUnmount() {
        this.map.destroy();
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this.map.update(nextProps.data);
    },

    setAccuracy: function setAccuracy(zoom) {
        var accuracy;
        if (zoom <= 7) {
            accuracy = 3;
        } else if (zoom <= 9) {
            accuracy = 4;
        } else if (zoom <= 12) {
            accuracy = 5;
        } else if (zoom <= 13) {
            accuracy = 6;
        } else {
            accuracy = 6;
        }

        this.setState({
            accuracy: accuracy
        });
    },

    onUpdate: function onUpdate(event) {
        // You will call the function from this.props.{function} here.
        // Calculate the accuracy based on the zoom level and pass it to the api.
        // The response data should come in the form of new props. See componentWillReceiveProps
        this.setAccuracy(this.map.map.getZoom());
        console.log(this.state.accuracy);
    },

    render: function render() {
        return _react2.default.createElement("div", { ref: "container", id: this.props.id });
    }
});