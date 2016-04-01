import _ from "lodash";
import Color from "color";
import L from "leaflet";

const TILE_LAYER_URL = 'https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ3ZpZG8iLCJhIjoiZGI1NmFhNmViNzZlZGNkMjQ3ZjdlMjVkZTMwNmFkNmEifQ.wnMrAkxOObDfpS1-KvPkqw'

var Utils = {
  getStandardDeviation: function getStandardDeviation (values, mean) {
    var variance = 0;

    values.forEach(function (amount) {
      variance += Math.pow(mean - amount, 2)
    });

    return Math.sqrt(variance /= values.length);
  }
};

var LeafletMap = function () {
  this.init(...arguments);
};

LeafletMap.prototype = {
  init: function (id, options = {}) {
    this.options = _.assign({
      zoom: 6,
      center: [52.374030, 4.8896900],
      baseColor: "#A32020"
    }, options);

    this.map = L.map(id).setView(this.options.center, this.options.zoom);

    L.tileLayer(TILE_LAYER_URL).addTo(this.map);
  },

  getStyle: function (bounds, feature) {
    return {
      fillColor: this.getColor(this.options.baseColor, feature.properties.amount, bounds),
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7
    };
  },

  update: function (data) {
    // If the geojson layer already exists remove it first before adding the new one.
    if (this.map.hasLayer(this.geojson)) {
      this.map.removeLayer(this.geojson);
    }

    if (this.data.features.length) {
      this.postingBounds = this.getBounds(data.features);

      this.geojson = L.geoJson(data, {
        pointToLayer: this.pointToLayer.bind(this)
      }).addTo(this.map);
    }
  },

  getBounds: function (items) {
    var mean,
        lowestAmount, // the lowest amount of postings
        highestAmount, // the highest amount of postings
        standardDeviation, // the standard deviation
        values, // all of the values from the response, used for working with the values easier;
        trimmedValues; // the values after being trimmed

    values = [];
    items.forEach(item => values.push(item.properties.amount));

    mean = _.mean(values);
    standardDeviation = Utils.getStandardDeviation(values, mean);

    // get a box to use for number trimming
    lowestAmount = mean - standardDeviation;
    highestAmount = mean + standardDeviation;

    console.log("High:", highestAmount, "Low:", lowestAmount);

    trimmedValues = _.filter(values, value => lowestAmount < value && highestAmount > value);

    //get the new lowest and highest posting amounts
    lowestAmount = Math.min(...trimmedValues);
    highestAmount = Math.max(...trimmedValues);

    return {
      lowest: lowestAmount,
      highest: highestAmount
    };
  },

  getColor: function (baseColor, amount, bounds) {
    var total, part, color, offset, percentage, slices;

    // Make the color with the baseColor
    color = Color(baseColor);

    // variables for the percentage calculation
    total = bounds.highest - bounds.lowest;
    part = amount - bounds.lowest;
    slices = 5; // Temporary, will be provided by the user.
    offset = 100 / slices;

    // Calculate the percentage
    percentage = Math.floor(part / total * 100);
    // get the percentage to be between 0-100
    percentage = Math.min(Math.max(percentage, 0), 100);
    // Get the the color brackets the percentage is in
    percentage = Math.floor(percentage / offset);
    // 1 - (100 / slices * percentage / 100)
    // 1 to invert the result
    // 100 / slices to get the percentage per slice
    // * percent The total percentage
    // / 100 to get it between 0-1

    return color.lighten(1 - (100 / slices * percentage / 100)).hexString();
  },

  pointToLayer: function (feature, latlng) {
    var divText, iconWidth, iconHeight, icon, color, style;

    color = this.getColor(this.options.baseColor, feature.properties.amount, this.postingBounds);
    divText = feature.properties.amount.toString();
    iconWidth = 5 * divText.length + 10;
    style = 'style="text-align: center; background-color:' + color + '"';

    icon = L.divIcon({
      iconSize: [iconWidth, iconWidth],
      iconAnchor: [iconWidth / 2, iconWidth / 2],
      className: "custom-leaflet-marker",
      html: "<div " + style + "><b>" + feature.properties.amount + "</b></div>"
    });

    return L.marker(latlng, {
      icon: icon
    });
  },

  destroy: function () {

  }
};

LeafletMap.create = function () {
  return new LeafletMap(...arguments);
};

export default LeafletMap;