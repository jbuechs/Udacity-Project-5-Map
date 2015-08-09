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
  render: function(){

  },
  // Loading markers on the map
  loadMarkers: function(){
    var marker, myLatlng, i, locArray;
    // Create InfoWindow
    var infowindow = new google.maps.InfoWindow({
      content: 'Hello, world!',
    });
    locArray = neighborhood.locations;
    this.markersArray = [];
    for (i = 0; i < locArray.length; i++) {
      myLatlng = new google.maps.LatLng(locArray[i].coord.lat, locArray[i].coord.lng);
      marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: locArray[i].name,
      });
      // Add click event listener to markers to open InfoWindow and bounce
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,this);
        this.setAnimation(google.maps.Animation.BOUNCE);
        stopAnimation(this);
      });
      this.markersArray.push(marker);
    }
  },
  toggleBounce: function() {

  },
};

mapViewModel.init();

  // Sidebar toggling on/off view on small screen
  $(document).ready(function() {
    $('[data-toggle=offcanvas]').click(function() {
      $('.row-offcanvas').toggleClass('active');
    });
});