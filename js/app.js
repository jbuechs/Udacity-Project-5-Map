// Initializes and creates the google map
var initialize = function(){
  mapOptions = {
  // Default map center: Madrid, Spain
    center: { lat: 40.4213473, lng: -3.7005081},

  // Default zoom
    zoom: 12,
  };
  // Create map
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  // Load markers
  mapViewModel.loadMarkers();
};

// Loads the script tag into end of body of html
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

function stopAnimation(marker) {
  setTimeout(function() {
    marker.setAnimation(null);
  }, 700);
}

var mapViewModel = {
  init: function(){
      window.onload = loadScript;
  },
  // Loading markers on the map
  loadMarkers: function(){
    var marker, myLatlng, i, locArray;
    // Create InfoWindow
    this.infowindow = new google.maps.InfoWindow({
      content: 'Hello, world!',
    });
    locArray = AVM.displayLoc();
    for (i = 0; i < locArray.length; i++) {
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
  //Change active state for sidebar links
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
  this.name = ko.observable(data.name);
  this.address = ko.observable(data.address);
  this.coord = ko.observable(data.coord);
  this.type = ko.observable(data.type);
  this.desc = ko.observable(data.desc);
  this.contentString = ko.computed(function(){
    var beginHTML = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>';
    var headerString = '<h1 id="firstHeading" class="firstHeading">' +
      this.name() +
      '</h1>' +
      '<div id="bodyContent">';
    var endHTML = '</div>'+
      '</div>';
//      console.log(beginHTML + headerString + endHTML);
      return beginHTML + headerString + endHTML;
  }, this);
};

function AppViewModel() {
  var self = this;
  this.koLocArray = ko.observableArray([]);
  var locationArray = neighborhood.locations;
// Initialize KO array of locations
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
  // Make clicked elment in list view be clicked on the marker
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