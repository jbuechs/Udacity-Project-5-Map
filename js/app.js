// Google Map API
function initialize() {
        var mapOptions = {

        // Default map center: Madrid, Spain
          center: { lat: 40.4213473, lng: -3.7005081},

        // Default zoom
          zoom: 12
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
      }
      google.maps.event.addDomListener(window, 'load', initialize);

// Sidebar toggling on/off view on small screen
$(document).ready(function() {
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
});