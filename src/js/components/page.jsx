import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

export default React.createClass({

  displayName: "Page",


  render: function () {
    return (
        <Map center={[51.505, -0.09]} zoom={13}>
          <TileLayer
              url='https://{s}.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ3ZpZG8iLCJhIjoiZGI1NmFhNmViNzZlZGNkMjQ3ZjdlMjVkZTMwNmFkNmEifQ.wnMrAkxOObDfpS1-KvPkqw'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>
              <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
            </Popup>
          </Marker>
        </Map>
    );
  }

});

