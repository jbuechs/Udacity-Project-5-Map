//Code for the Google Map API

function initialize() {
        var mapOptions = {

        // Default map center: Madrid, Spain
          center: { lat: 40.4213473, lng: -3.7005081},

        // Defalut zoom
          zoom: 12
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
      }
      google.maps.event.addDomListener(window, 'load', initialize);