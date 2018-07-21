var loc = {
	lat: null,
	lon: null,

	// get user's location if possible
	getLocation: function() {
		if ("geolocation" in navigator) {
			var watchID = navigator.geolocation.watchPosition(function(position) {
				loc.lat = position.coords.latitude;
				loc.lon = position.coords.longitude;

				console.log("lat: " + loc.lat);
				console.log("lon: " + loc.lon);
			});
		}
	}
};

$.ajax({
    method: "GET",
    crossDomain: true,
    // count is how many restaurants we want
    // establishment_type is the type of restaurant we want
    url: "https://developers.zomato.com/api/v2.1/search?count=10&lat=" + loc.lat + "lon=" + loc.lon + "&radius=2",
    dataType: "json",
    async: true,
    headers: {
      "user-key": "7e43dd3df445b7aee59f4e05cf1204c7"
    },
    success: function(data) {
        console.log(data);
      var res = [];
      res = data.restaurants;
      for (var j = 0; j < res.length; j++) {
    
          $('.results').append("<div class='name'>" + "Restaurant: " + res[j].restaurant.name + "</div>" + "\n" + "<div class='cuisines'>" + res[j].restaurant.cuisines + "</div>");
 
      }
    },
    error: function() {
      $('.results').append("<div>Sorry, data is not coming through. Refresh and try again.</div>");
    }
  });
