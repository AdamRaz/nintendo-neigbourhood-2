import React, { Component } from 'react';

class LocationList extends Component {

  state = {
    locations: ['york', 'london', 'londonderry', 'new york', 'yorkshire'],
    drinkPlaces: [{
      name: 'click a marker/location to find out!',
      address: 'nowhere'
    }],
    extraData: []
  }

  filterLocations = (event) => {
    // AR - does not work for search key words in opposite/wrong order
    let searchTerm = event.target.value;
    let trimmedSearchTerm = searchTerm.trim().toLowerCase();
    if (trimmedSearchTerm) {
      // console.log(trimmedSearchTerm);
      this.filteredLocations = this.state.locations.filter((location) => location.lowerCaseName.includes(trimmedSearchTerm));
      // console.log(this.filteredLocations);
      this.setState({filteredLocations: this.filteredLocations});
      this.props.updateAppFilteredLocations(this.filteredLocations);
    } else {
      // console.log("resetting filtered locations");
      this.setState({filteredLocations: this.props.locations});
      this.props.updateAppFilteredLocations(this.props.locations);
    }
  }

  componentWillReceiveProps(newProps)  {
    // console.log("list component recieving props");
    // console.log(this.props.mapTarget);
    //  console.log(newProps.maindata)
    
    // TODO - strange bug where must click marker a few times before props update, even though devTools react show state/props are fine!!!
  }
  

  componentWillMount () {
    this.setState({locations: this.props.locations})
    this.setState({filteredLocations: this.props.locations});
    this.filteredLocations = this.props.locations;
    // console.log("location list data from props:")
    // console.log(this.props.locations);
    let locations = this.props.locations;
    
    for (let i = 0; i < locations.length; i++) {
      let lat2 = locations[i].location.lat;
      let lng2 = locations[i].location.lng;
     
      // see - https://developer.foursquare.com/docs/api/getting-started
      fetch(`https://api.foursquare.com/v2/venues/explore?&client_id=JIN1RTWFVHTESSF0J51MA2R3POD12X4OEI0LFR4I0YBUHMAJ&client_secret=PD4XAVZK5ADSLYJORCUGK3JKJEWCPANFKIENMGG3NZYW03V1&query=milkshake&limit=2&v=20180323&ll= ${lat2},${lng2}`)
      .catch(() => window.alert("FourSquare data request error, please refresh page!")) 
      .then(body => body.json())
      .then(response => 
        this.setState( state => ({
            extraData: state.extraData.concat([response])
          })
        )
      )
    }
    // console.log(this.state.locations);
    // console.log(this.props.locations[0].title);
  }

  render() {
    this.locations = this.state.filteredLocations;
    this.drinkPlaces = this.state.drinkPlaces;
    this.mapTarget = this.props.mapTarget;
    this.updateSidebar = this.props.updateSidebarFromList;

    let id = this.mapTarget.id;
    let locationName;
    // console.log("location render function");
    if (id >= 0) {
      // console.log(this.state.extraData[id].response.groups.items[0].venue.name);
      let item = this.state.extraData[id].response.groups;
      // console.log(item[0].items[0].venue.name);
      // console.log(item[0].items[0].venue.location.address);
      this.drinkPlaces[0].name = item[0].items[0].venue.name;
      this.drinkPlaces[0].address = item[0].items[0].venue.location.address;
      locationName = 'near ' +this.locations[id].title;

    }

    return (
      <div className="location-list">
        <div className="location-list-items">
        <h2>locations</h2>
        {/* made h2 as h1 taken by main app heading */}
        <input onChange={(event) => this.filterLocations(event)} type='text' placeholder='search locations'/>
          <div className="location-list-elements-container">
          <ul className="location-list-elements" aria-label="selectable location list">
            {this.locations.map((location) => (
              <li  onClick={(event) => this.updateSidebar(event, location.id)} key={location.id} role="button" className="location-list-options" tabIndex="0">
              {location.title}
                <br/>
                {/* AR - buttons replaced with onClick events on list items abov */}

                {/* <button onClick={(event) => this.updateSidebar(event, location.id)} className='see-sidebar-info'>
                  Info
                </button> */}

              </li>
            ))}
          </ul>
          </div>
        </div>
        <div className="location-list-info">
          <h2>location info</h2>
          <h3>where to get a milkshake {locationName}:</h3>
          <ul className="drink-list-elements">
            {this.drinkPlaces.map((place) => (
            <li key={place.name}>{place.name},<br/> {place.address}</li>
            ))}
          </ul>
          <p className="api-credit">using Foursquare data</p>
        </div>
      </div>
    );
  }
}

export default LocationList;