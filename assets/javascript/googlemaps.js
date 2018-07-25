var GOOGLE_MAPS_URL = "https://maps.google.com/?";

function createGoogleMap(location)
{
    // set some default map details, initial center point, zoom and style
    var mapOptions = {
        center: new google.maps.LatLng(location.lat, location.lon),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    // create the map and reference the div#map-canvas container
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}