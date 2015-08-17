//Foursquare API
var CLIENT_ID = '2R1R4RS5FIXI3P4MO04O4QCNFLXDUL5WUOXSVGG4SV3N2AM5';
var CLIENT_SECRET = 'NUN3OJIAXIUR2JUKRR12MLXH0PQND0IOM1QINSDED0HNSWCU';

// Initializes and creates the google map
var initialize = function(){
  mapOptions = {
  // Default map center: Madrid, Spain
    center: { lat: 40.4213473, lng: -3.7005081},

  // Default zoom
    zoom: 14,
  };
  // Create map
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  // Load markers
  mapViewModel.loadMarkers();
};

// Loads the script tag for Google Map API into end of body of html
var loadScript = function(){
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.onerror = function() {
    $('#map-canvas').text('Error loading Google Map');
  };
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
      '&signed_in=true&callback=initialize';
  document.body.appendChild(script);
};

// Clicked marker bounces one time
function stopAnimation(marker) {
  setTimeout(function() {
    marker.setAnimation(null);
  }, 700);
}

// Google Map API
var mapViewModel = {
  init: function(){
      window.onload = loadScript;
  },
  // Loading markers on the map
  loadMarkers: function(){
    var marker, myLatlng, i, locArray;
    // Create one InfoWindow
    this.infowindow = new google.maps.InfoWindow({
      content: 'There was an error loading the content.',
    });
    locArray = AVM.displayLoc();
    for (i = 0; i < locArray.length; i++) {
      //Create a marker for each location object in the model
      myLatlng = new google.maps.LatLng(locArray[i].coord().lat, locArray[i].coord().lng);
      marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: locArray[i].name(),
        visible: true,
        info: locArray[i].contentString(),
      });
      // Add click event listener to markers to update & open InfoWindow and bounce
      google.maps.event.addListener(marker, 'click', function() {
        mapViewModel.infowindow.setContent(this.info);
        mapViewModel.infowindow.open(map,this);
        this.setAnimation(google.maps.Animation.BOUNCE);
        stopAnimation(this);
      });
      AVM.koLocArray()[i].marker = marker;
    }
  },
};

$(document).ready(function() {
  var items;
  // Sidebar toggling on/off view on small screen
    $('[data-toggle=offcanvas]').click(function() {
      $('.row-offcanvas').toggleClass('active');
    });
  // Change active state for sidebar links when clicked
    $('li').click(function() {
      items = document.getElementsByTagName('li');
      for (var i = 0; i < items.length; i++) {
        items[i].className = '';
      }
      $(this).addClass('active');
    });
});

// BEGIN KNOCKOUT CODE

// Create location object
var locObj = function(data) {
  var self = this;
  this.name = ko.observable(data.name);
  this.address = ko.observable(data.address);
  this.coord = ko.observable(data.coord);
  this.type = ko.observable(data.type);
  this.desc = ko.observable(data.desc);
  this.venue_id = data.venue_id;
  $.ajax({
    url: 'https://api.foursquare.com/v2/venues/' + this.venue_id,
    dataType: 'json',
    data: 'client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20140806',
    async: true,
    hotspot: self,
    success: function(data) {
      console.log(data.response.venue.rating, self);
      this.hotspot.rating = data.response.venue.rating;
    }
  });
  console.log(this.name(), this.rating);
  this.contentString = ko.computed(function(){
    var self = this;
    var beginHTML = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>';
    var headerString = '<h4 id="firstHeading" class="firstHeading">' +
      this.name() +
      '</h4>' +
      '<div id="bodyContent">';
    var addressString = '<p><b>Address:</b> ' + this.address() + '</p>';
    var descString = '<p><b>Description:</b> ' + this.desc() + '</p>';
    var ratingString = '<p><b>Foursquare rating:</b> <span id="fourRating">' + this.rating + '</span></p>';
    var endHTML = '</div>'+
      '</div>';
      return beginHTML + headerString + addressString + descString + ratingString + endHTML;
  }, this);
};

function AppViewModel() {
  var self = this;
  this.koLocArray = ko.observableArray([]);
  var locationArray = neighborhood.locations;
// Parsing neighborhood model to create KO array of locations
  locationArray.forEach(function(loc) {
    self.koLocArray.push(new locObj(loc));
  });
// Initialize filter term to null
  this.filter = ko.observable('');
// Display locations in displayLoc array based on filter term
  this.displayLoc = ko.computed(function() {
    var filter = this.filter().toLowerCase();
    if (!filter) {
      for (var i = 0; i < this.koLocArray().length; i++) {
        if (this.koLocArray()[i].marker) {
          this.koLocArray()[i].marker.setVisible(true);
        }
      }
      return this.koLocArray();
    }
    else {
      return ko.utils.arrayFilter(this.koLocArray(), function(item) {
        var match = item.name().toLowerCase().indexOf(filter) != -1;
        item.marker.setVisible(match);
        return match;
      });
    }
  }, this);
  // Make clicked element in list view be clicked on the marker
  this.clickMarker = function() {
    google.maps.event.trigger(this.marker, 'click');
  };
  // Update content in infoWindow
  this.updateContent = function(marker){
    var itemMarker, match;
    match = false;
    var locArray = this.koLocArray();
    for (var i = 0; i < locArray.length; i++) {
      if (locArray[i].marker == marker) {
        mapViewModel.infowindow.setContent(AVM.koLocArray()[i].contentString());
      }
    }
  };
}

// Activates knockout.js
var AVM = new AppViewModel();
window.onload = loadScript;
ko.applyBindings(AVM);