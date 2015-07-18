var React = require('react');
var $ = require('jquery');
var _ = require('lodash');
var classNames = require('classnames');

require('./app.less');

L.mapbox.accessToken = 'pk.eyJ1IjoiY2hhY29ubmV3dSIsImEiOiI4NjNkZWRkZmQ1MTk2NmIwMjQ2YWEwYzE0ZjJkODFjNCJ9.kpgKT1D3pk_v-q52rS4t7g';

var YearSlider = React.createClass({
  propTypes: {
    setYearRange: React.PropTypes.func.isRequired
  },
  componentDidMount () {
    var self = this;
    var slider = this.getDOMNode();
    noUiSlider.create(slider, {
    	start: [ 1915, 2015 ], // Handle start position
    	step: 1,
    	limit: 100,
    	connect: true, // Display a colored bar between the handles
    	orientation: 'horizontal',
    	behaviour: 'tap-drag', // Move handle on tap, bar is draggable
    	range: {
    		'min': 1915,
    		'max': 2015
    	},
    	pips: { // Show a scale with the slider
    		mode: 'range',
    		density: 10
    	}
    });
    slider.noUiSlider.on('change', function() {
      var range = slider.noUiSlider.get();
      var startYear = parseInt(range[0], 10);
      var endYear = parseInt(range[1], 10);
      self.props.setYearRange(startYear, endYear);
    });
  },
  render () {
    return (
      <div className='ten wide column'>
      </div>
    );
  }
});

var MapView = React.createClass({
  propTypes : {
    geoJSON: React.PropTypes.array.isRequired
  },
  componentDidMount () {
    this.map = L.mapbox.map(this.getDOMNode(), 'mapbox.pirates')
      .setView([37.77,-122.43], 12);
  },
  componentWillReceiveProps (nextProps) {
    var self = this;
    if (self.markers) {
      self.map.removeLayer(self.markers);
    }
    var geoJSONLayer = L.geoJson(nextProps.geoJSON);
    self.markers = new L.MarkerClusterGroup();
    self.markers.addLayer(geoJSONLayer);
    this.map.addLayer(self.markers);
  },

  render () {
    return (
      <div className='MC-Map'>
      </div>
    );
  }
});

var MovieList = React.createClass({
  propTypes : {

  },
  render () {
    return (
      <div>

      </div>
    );
  }
});

var Page = React.createClass({
  getInitialState () {
    return {
      displayGeoJSON : [],
      movieData : [],
      yearRange : [1915, 2015]
    };
  },
  setYearRange (startYear, endYear) {
    var self = this;
    var cache = {};
    geoJson = [];
    movieGeoJSON = _.cloneDeep(self.state.movieData);
    movieGeoJSON.forEach(function(movie) {
      if (movie.year > endYear || movie.year < startYear) {
        return;
      }
      for (var i = 0; i < movie.locations.length; i++) {
        if (movie.locations[i]['real address'] in cache) {
          continue;
        }
        var geoObj = {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [movie.locations[i]['lng'], movie.locations[i]['lat']],
          },
          'properties': {
            'marker-color' : '#3bb2d0',
            'marker-size' : 'small'
          }
        };
        geoJson.push(geoObj);
        cache[movie.locations[i]['real address']] = 1;
      }
    });

    self.setState({
      displayGeoJSON: geoJson,
      yearRange: [startYear, endYear]
    });
  },
  componentDidMount () {
    var self = this;
    $.getJSON('movie_geo_data.json').done(function(movieData) {
      var cache = {};
      geoJson = [];
      movieGeoJSON = movieData;
      console.log(movieData);
      movieGeoJSON.forEach(function(movie) {
        for (var i = 0; i < movie.locations.length; i++) {
          if (movie.locations[i]['real address'] in cache) {
            continue;
          }
          var geoObj = {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [movie.locations[i]['lng'], movie.locations[i]['lat']],
            },
            'properties': {
              'marker-color' : '#3bb2d0',
              'marker-size' : 'small'
            }
          };
          geoJson.push(geoObj);
          cache[movie.locations[i]['real address']] = 1;
        }

      });
      self.setState({
        displayGeoJSON : geoJson,
        movieData : movieData
      });
    }).fail(function() {
      console.log('loading geoJSON error ...');
    });
  },

  render () {
    var self = this;
    var yearRange = self.state.yearRange;
    
    return (
      <div className='ui grid'>
        <div className='ui row'>
          <div className='five wide column'>
          </div>
          <div className='five wide column'>
            <h1 className='ui blue header'>Movie Connect</h1>
          </div>
        </div>

        <div className='ui row'>
          <div className='one wide column'>
          </div>
          <div className='ten wide column'>
            <h4 class='ui header'>Movie Connect is a web application that allows you to explore the filming locations for the movies that were filmed in San Francisco, CA.</h4>
          </div>
        </div>

        <div className='ui row'>
          <div className='one wide column'>
          </div>
          <div className='nine wide column'>
            <div className={classNames('ui row', 'MC-YearSlider')}>
              <YearSlider setYearRange={self.setYearRange}/>
            </div>

            <div className='ui row'>
              <div className='nine wide column'>
                <h3 className='ui blue header'>
                  From {yearRange[0]} to {yearRange[1]}, the following locations in San Francisco had movie filming events:
                </h3>
              </div>
            </div>

            <div className='ui row'>
              <MapView geoJSON={this.state.displayGeoJSON}/>
            </div>
          </div>
          <div className='four wide column'>
            <div className='ui row'>
              <div className='four wide column'>
                <div className='ui fluid icon input'>
                  <input type='text' placeholder='Search for a movie' />
                  <i className='search icon'></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});


React.render(<Page />, document.getElementById('app'));
