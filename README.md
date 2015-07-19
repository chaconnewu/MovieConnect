# MovieConnect

## Introduction
Movie Connect is a web application that allows user to explore filming locations
of movie filmed in San Francisco. It is available at http://dataagent.org:3000

The movie data is collected from [SF OpenData] (https://data.sfgov.org/Culture-and-Recreation/Film-Locations-in-San-Francisco/yitu-d5am).
Locations are retrieved by Google Map Services API using Python.

A screenshot is presented in the following image:
![Description](https://raw.githubusercontent.com/chaconnewu/MovieConnect/master/intro.png)

## Features
### 1. Slider
The releasing years of the included movies range from 1915 to 2015. The slider can
be changed from both ends, and can be dragged as a whole. It filters the included
movie in the MovieList.

### 2. MapView header label
By sliding the slider, the years included in the header label will change accordingly
to reflect the movies that are included.

### 3. MapView
MapView displays and clusters filming locations in San Francisco. Numbers indicate
how many locations are clustered. Clusters will change accordingly by zooming-in
or zomming-out. Clicking a non-clustered location will show the street view below.

### 4. StreeView
StreeView retrieves street view pictures of a certain location using Google Street
View service.

### 5. MovieList
MovieList contains the currently included movies in the page. It can be changed by
both slider and SearchBar. Users can select a movie to show:
* Its detailed info below
* The filming locations of the movie in the MapView

### 6. Movie SearchBar
Movie SearchBar allows you to search for the title of a movie. Search is completed
by matching substring.

### 7. Movie Detailed Info
Movie detailed info displays some simple information of a selected movie.

### 8. Reset Button
Reset button clears slider, SearchBar, and selection in MovieList.

## Known Issues
1. StreetView doesn't hide after Reset
2. For some locations, Google StreetView API does not return images
3. StreetView cannot be reset

## Technology Stack
**Server**:
[Node.js] (https://nodejs.org/)

**Client**:
[jQuery] (https://jquery.com/)
[Google Map API] (https://developers.google.com/maps/documentation/javascript/)
[Less] (http://lesscss.org/)
[Lodash] (https://lodash.com/)
[Mapbox.js] (https://www.mapbox.com/mapbox.js/)
[React.js] (https://facebook.github.io/react/)
[Semantic UI] (http://semantic-ui.com/)
[Webpack.js] (https://webpack.github.io/)


## Contact
Please submit an issue request or contact me at chaconnewu AT gamil dot com if
you have any comments or suggestions.

Thannks!
Yu Wu
