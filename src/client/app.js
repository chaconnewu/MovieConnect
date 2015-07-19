var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var classNames = require('classnames');

require('./app.less');

L.mapbox.accessToken = 'pk.eyJ1IjoiY2hhY29ubmV3dSIsImEiOiI4NjNkZWRkZmQ1MTk2NmIwMjQ2YWEwYzE0ZjJkODFjNCJ9.kpgKT1D3pk_v-q52rS4t7g';

var YearSlider = React.createClass({
  propTypes : {
    setYearRange : React.PropTypes.func.isRequired
  },

  componentDidMount () {
    var self = this;
    self.slider = self.getDOMNode();
    noUiSlider.create(self.slider, {
    	start : [1915, 2015],
    	step : 1,
    	limit : 100,
    	connect: true,
    	orientation: 'horizontal',
    	behaviour: 'tap-drag',
    	range: {
    		'min': 1915,
    		'max': 2015
    	},
    	pips: {
    		mode: 'range',
    		density: 10
    	}
    });
    self.slider.noUiSlider.on('change', function() {
      var range = self.slider.noUiSlider.get();
      var startYear = parseInt(range[0], 10);
      var endYear = parseInt(range[1], 10);
      self.props.setYearRange(startYear, endYear);
    });
  },

  componentWillReceiveProps (nextProps) {
    var self = this;
    if (nextProps.reset) {
      self.slider.noUiSlider.set([1915, 2015]);
    }
  },

  render () {
    return (
      <div className='ten wide column'>
      </div>
    );
  }
});

var Panorama = React.createClass({
  propTypes : {
    coord : React.PropTypes.object.isRequired
  },

  componentWillReceiveProps (nextProps) {
    var self = this;

    if (nextProps.coord) {
      var lat = parseFloat(nextProps.coord.lat);
      var lng = parseFloat(nextProps.coord.lng);
      var pos = new google.maps.LatLng(lat, lng);
      var panoramaOptions = {
        position: pos,
        pov: {
          heading: 34,
          pitch: 10
        }
      };
      self.panorama =
        new google.maps.StreetViewPanorama(self.getDOMNode(), panoramaOptions);
    } else {
      if (self.panorama) {
        self.panorama.setVisible(false);
      }
    }
  },

  render () {
    var self = this;
    return (
      <div
        className={'MC-Panorama'}
      >
      </div>
    );
  }
});

var MapView = React.createClass({
  propTypes : {
    movieList : React.PropTypes.array.isRequired,
    selectedMovie : React.PropTypes.object.isRequired,
    setCoord : React.PropTypes.func.isRequired
  },

  componentDidMount () {
    var self = this;
    self.map = L.mapbox.map(self.getDOMNode(), 'mapbox.pirates')
      .setView([37.77,-122.43], 12);
  },

  componentWillReceiveProps (nextProps) {
    var self = this;
    var cache = {};
    var geoJson = [];
    var movieList = !nextProps.selectedMovie ?
      nextProps.movieList : [nextProps.selectedMovie];
    movieList.forEach(function(movie) {
      for (var i = 0; i < movie.locations.length; i++) {
        if (cache.hasOwnProperty(movie.locations[i]['real address'])) {
          continue;
        }
        var geoObj = self.makeGeoObj(movie.locations[i]);
        geoJson.push(geoObj);
        cache[movie.locations[i]['real address']] = 1;
      }
    });
    if (self.markers) {
      self.map.removeLayer(self.markers);
    }
    var geoJSONLayer = L.geoJson(geoJson);
    self.markers = new L.MarkerClusterGroup();
    self.markers.addLayer(geoJSONLayer);
    self.markers.on('click', function(d) {
      self.props.setCoord(d.latlng);
    });
    self.map.addLayer(self.markers);
  },

  makeGeoObj (location) {
    return {
      'type' : 'Feature',
      'address' : location['real address'],
      'geometry' : {
        'type' : 'Point',
        'coordinates' : [location.lng, location.lat],
      },
      'properties' : {
        'marker-color' : '#3bb2d0',
        'marker-size' : 'small'
      }
    };
  },

  render () {
    return (
      <div className='MC-Map'>
      </div>
    );
  }
});

var MovieDetail = React.createClass({
  propTypes : {
    movieItem : React.PropTypes.object.isRequired
  },

  render () {
    var self = this;
    var movieItem = self.props.movieItem;
    if (!movieItem) return <div></div>;
    var actors = [movieItem.actor1, movieItem.actor2, movieItem.actor3];
    actors = actors.filter(function(actor) {
      return actor.length > 0;
    });
    actors = actors.join(', ');

    return (
      <div className='MC-MovieDetail'>
        <div className={classNames('ui row', 'MC-MovieDetail-Title')}>
          <h3 className='ui blue header'>
            {movieItem.title + ' (' + movieItem.year + ')'}</h3>
        </div>
        <div className={classNames('ui row', 'MC-MovieDetail-InfoRow')}>
          <div className='ui label'>Director: </div>
          <span>{movieItem.director}</span>
        </div>
        <div className={classNames('ui row', 'MC-MovieDetail-InfoRow')}>
          <div className='ui label'>Writer: </div>
          <span>{movieItem.writer}</span>
        </div>
        <div className={classNames('ui row', 'MC-MovieDetail-InfoRow')}>
          <div className='ui label'>Actors: </div>
          <span>{actors}</span>
        </div>
        <div className={classNames('ui row', 'MC-MovieDetail-InfoRow')}>
          <div className='ui label'>Fun Facts: </div>
          <span>{movieItem.facts}</span>
        </div>
      </div>
    );
  }
});

var MovieItem = React.createClass({
  propTypes : {
    index : React.PropTypes.number.isRequired,
    movieItem : React.PropTypes.object.isRequired,
    selectMovie : React.PropTypes.func.isRequired
  },

  itemClick () {
    var self = this;
    self.props.selectMovie(self.props.index);
  },

  render () {
    var self = this;
    return (
      <div
        className={self.props.movieItem.selected ?
          'MC-MovieItem-selected' : 'MC-MovieItem'}
        onClick={self.itemClick}
      >
        {self.props.movieItem.title}
      </div>
    );
  }
});

var MovieList = React.createClass({
  propTypes : {
    movieList : React.PropTypes.array.isRequired,
    selectMovie : React.PropTypes.func.isRequired
  },

  render () {
    var self = this;
    var movieList = self.props.movieList.map(function(movieItem, idx) {
      return (
        <MovieItem
          movieItem={movieItem}
          index={idx}
          selectMovie={self.props.selectMovie}
        />
      );
    });
    return (
      <div className='MC-MovieList'>
        {movieList}
      </div>
    );
  }
});

var SearchBar = React.createClass({
  propTypes : {
    searchForMovie : React.PropTypes.func.isRequired,
    yearRange : React.PropTypes.array.isRequired
  },

  componentWillReceiveProps (nextProps) {
    var self = this;
    console.log(nextProps);
    if (nextProps.reset) {
      React.findDOMNode(self.refs.searchInput).value = '';
    }
  },

  searchInputChange (e) {
    var self = this;
    var searchQuery = e.target.value.trim();
    self.props.searchForMovie(searchQuery);
  },

  render () {
    var self = this;
    var startYear = self.props.yearRange[0];
    var endYear = self.props.yearRange[1];
    var placeholder = 'Find a movie between ' +
      startYear + '~' + endYear;
    return (
      <div className='ui fluid icon input'>
        <input
          type='text'
          placeholder={placeholder}
          onChange={self.searchInputChange}
          ref='searchInput'
        />
        <i className='search icon'></i>
      </div>
    );
  }
});

/*
 * React Component that manages states and lays out the UI structure
 */
var Page = React.createClass({
  getInitialState () {
    return {
      displayMovieData : [],
      movieData : [],
      selectedMovie : null,
      streetViewCoord : null,
      yearRange : [1915, 2015]
    };
  },

  clearSelection () {
    var self = this;
    self.setState({
      selectedMovie : null,
      streetViewCoord : null
    });
  },

  comparator (a, b) {
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  },

  componentDidMount () {
    var self = this;
    $.getJSON('movie_geo_data.json').done(function(movieData) {
      movieData = movieData.map(function(movie) {
        movie.selected = false;
        return movie;
      });
      movieData = movieData.sort(self.comparator);
      self.setState({
        displayMovieData : movieData,
        movieData : movieData
      });
    }).fail(function() {
      console.log('loading geoJSON error ...');
    });
  },

  reset () {
    var self = this;
    self.setState({
      displayMovieData : self.state.movieData,
      reset : true,
      selectedMovie : null,
      streetViewCoord : null,
      yearRange : [1915, 2015]
    });
  },

  setYearRange (startYear, endYear) {
    var self = this;
    self.setState({
      reset : false,
      yearRange: [startYear, endYear]
    });
    self.clearSelection();
  },

  selectMovie (index) {
    var self = this;
    var movieData = self.state.displayMovieData.map(function(movie) {
      movie.selected = false;
      return movie;
    });
    movieData[index].selected = true;
    var streetViewCoord = movieData[index].locations[0];
    self.setState({
      displayMovieData : movieData,
      selectedMovie : movieData[index],
      streetViewCoord : streetViewCoord
    });
  },

  setStreetViewCoord (coord) {
    var self = this;
    self.setState({
      streetViewCoord : coord
    });
  },

  searchForMovie (query) {
    var self = this;
    var movieTmp = _.cloneDeep(self.state.movieData);
    var movieList = [];
    movieTmp.forEach(function(movieItem) {
      if (
        movieItem.year < self.state.yearRange[0] ||
        movieItem.year > self.state.yearRange[1]
      ) {
        return;
      }
      if (movieItem.title.toLowerCase().includes(query.toLowerCase())) {
        movieList.push(movieItem);
      }
    });

    self.setState({
      displayMovieData : movieList,
      reset : false
    });
    self.clearSelection();
  },

  render () {
    var self = this;
    var startYear = self.state.yearRange[0];
    var endYear = self.state.yearRange[1];

    var movieTmp = _.cloneDeep(self.state.displayMovieData);
    var movieList = [];
    movieTmp.forEach(function(movie) {
      if (movie.year > endYear || movie.year < startYear) {
        return;
      }
      movieList.push(movie);
    });

    return (
      <div className='ui grid'>
        <div className={classNames('ui row', 'MC-TitleRow')}>
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
            <h4 className='ui header'>Movie Connect is a web application that allows you to explore the filming locations for the movies that were filmed in San Francisco, CA.</h4>
          </div>
        </div>

        <div className='ui row'>
          <div className='one wide column'>
          </div>
          <div className='nine wide column'>
            <div className={classNames('ui row', 'MC-YearSlider')}>
              <YearSlider
                clearSelection={self.clearSelection}
                setYearRange={self.setYearRange}
                reset={self.state.reset}
              />
            </div>
          </div>
          <div className='four wide column'>
            <div
              className='ui red button'
              onClick={self.reset}
            >
              Reset
            </div>
          </div>
        </div>

        <div className='ui row'>
          <div className='one wide column'>
          </div>
          <div className='nine wide column'>
            <h3 className='ui blue header'>
              From {startYear} to {endYear}, the following locations in San Francisco had movie filming events
            </h3>
          </div>
          <div className='four wide column'>
            <SearchBar
              searchForMovie={self.searchForMovie}
              yearRange={self.state.yearRange}
              reset={self.state.reset}
            />
          </div>
        </div>

        <div className='ui row'>
          <div className='one wide column'>
          </div>
          <div className='nine wide column'>
            <MapView
              movieList={movieList}
              selectedMovie={self.state.selectedMovie}
              setCoord={self.setStreetViewCoord}
            />
          </div>
          <div className='four wide column'>
            <MovieList
              movieList={movieList}
              selectMovie={self.selectMovie}
            />
          </div>
        </div>

        <div className='ui row'>
          <div className='one wide column'>
          </div>
          <div className='nine wide column'>
            <Panorama
              coord={self.state.streetViewCoord}
            />
          </div>
          <div className='four wide column'>
            <MovieDetail
              movieItem={self.state.selectedMovie}
            />
          </div>
        </div>

      </div>
    );
  }
});

React.render(<Page />, document.getElementById('app'));
