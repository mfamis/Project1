// hides the div when we click on get started button
$("#results").hide();
$(".showandhide").hide();

$().ready(function () {
	loc.getLocation();
	exclusion.getStored();
	page.setFindClick();
	
	$(".btn").on("click", function () {
		$(".jumbotron").hide();
		$("#results").fadeIn();
		$("#map-canvas").fadeIn();
	});
});

// location data, functions
var loc = {
	lat: null,
	lon: null,
	
	// get user's location if browser supports it
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

// cuisine exclusion data, functions
var exclusion = {
	preferences: { excludedCuisines: [] },
	
	// get saved exclusions from localStorage
	getStored: function() {
		for (var i = 0; i < localStorage.length; i++) {
			var new_exclusion = localStorage.getItem(`stored_${i}`);
			if (exclusion.preferences.excludedCuisines.indexOf(new_exclusion) == -1 && new_exclusion != null) {
				exclusion.preferences.excludedCuisines.push(new_exclusion);
				console.log(`loaded: ${new_exclusion}`);
			}
		}
	},
	
	// add click listener to #resultType
	setTypeListener: function() {
		$(".result_type").one("click", function() {
			var type = $(this).data("type").trim();
			var index = localStorage.length;
			
			exclusion.preferences.excludedCuisines.push(type);
			localStorage.setItem(`stored_${index}`, type);

			$(this).addClass("text_strikethrough");
			console.log(`stored: ${type}`);
		});
	}
};

// various page-element functions 
var page = {
	setFindClick: function() {
		$(".btn").click(function() {
			$("#results").empty();

			var preferences = exclusion.preferences;
			
			var restaurants = getNearbyRestaurants(loc, preferences);
			var randomIndex = Math.floor(Math.random() * restaurants.length);
			var restaurant = restaurants[randomIndex];
			
			var splitTypes = restaurant.foodType.split(',');
			
			$("<h2>", {
				id: "result_name",
				text: restaurant.name
			}).appendTo(".restaurant-name");
			
			$("<img>", {
				id: "result_image",
				src: restaurant.image,
			}).appendTo("#results");
			

			// add clickable food types
			var result_types = $("<div></div>");
			result_types.attr("id", "result_types");

			for (t in splitTypes) {
				$("<p>", {
					class: "result_type",
					id: `result_type_${t}`,
					text: splitTypes[t],
					"data-type": splitTypes[t]
				}).appendTo(result_types);
			}
			$("#results").append(result_types);
			exclusion.setTypeListener();
			
			
			$("<p>", {
				id: "result_description",
				text: restaurant.description
			}).appendTo("#results");
			
			$("<p>", {
				id: "result_link",
				html: "<a href='" + restaurant.link + "' target='_blank'>" + "See more"+ "</a>"
			}).appendTo("#results");
			
			var displayMap=createGoogleMap({ lat: restaurant.lat, lon: restaurant.lon });
			$("#map-canvas").append(displayMap);

			// scroll smoothly to results
			$([document.documentElement, document.body]).animate({
				scrollTop: $("#results").offset().top
			}, 1000);
		});
	}
};

// // namespace object for food-finding functions
// var rest_test = {

//   restaurants: [{
//     name: "McDonald's",
//     image:"url",
//     foodtype:"American",
//     description:"fast food",
//     link:"url"
//   }],

//   setFoodClick: function() {
//     $("#findfood").click(function() {
//       var resultsBody = $("<div>");

//       var resultsName = $("<h2>").text(getNearbyRestaurants().name);
//       resultsName.addClass("");

//       var resultsImage = $("<p>").text(getNearbyRestaurants().image);
//       resultsImage.addClass("");

//       var resultsFood = $("<p>").text(getNearbyRestaurants().foodtype);
//       resultsFood.addClass("");

//       var resultsDescription = $("<p>").text(getNearbyRestaurants().description);
//       resultsDescription.addClass("");

//       var resultsLink = $("<p>").text(getNearbyRestaurants().link);
//       resultsLink.addClass("");

//       resultsBody.append(resultsName, resultsImage, resultsFood, resultsDescription, resultsLink);
//       $('#results').append(resultsBody);
//     });
//   },

//   getNearbyRestaurants: function() {
//     return restaurants[Math.floor(Math.random()*restaurants.length)];
//   },

//   getNearbyLoc: function() {
//     $.ajax({
//       method: "GET",
//       crossDomain: true,
//       // count is how many restaurants we want
//       // establishment_type is the type of restaurant we want
//       url: "https://developers.zomato.com/api/v2.1/search?count=10&lat=" + loc.lat + "lon=" + loc.lon + "&radius=2",
//       dataType: "json",
//       async: true,
//       headers: {
//         "user-key": "7e43dd3df445b7aee59f4e05cf1204c7"
//       },

//       success: function(data) {
//           console.log(data);
//         var res = [];
//         res = data.restaurants;
//         for (var j = 0; j < res.length; j++) {

//             $('.results').append("<div class='name'>" + "Restaurant: " + res[j].restaurant.name + "</div>" + "\n" + "<div class='cuisines'>" + res[j].restaurant.cuisines + "</div>");

//         }
//       },

//       error: function() {
//         $('.results').append("<div>Sorry, data is not coming through. Refresh and try again.</div>");
//       }
//     });
//   }
// };
