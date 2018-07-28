// hides the div when we click on get started button
$("#results").hide();
$(".showandhide").hide();
$("#try_again").hide();

$().ready(function () {
	loc.getLocation();
	exclusion.getStored();
	page.setFindClick();

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
		$("#exclusion").hide();

		for (var i = 0; i < localStorage.length; i++) {
			var new_exclusion = localStorage.getItem(`stored_${i}`);
			if (exclusion.preferences.excludedCuisines.indexOf(new_exclusion) == -1 && new_exclusion != null) {
				exclusion.preferences.excludedCuisines.push(new_exclusion);
				console.log(`loaded: ${new_exclusion}`);
				$("#exclusion_list").append(`<p>${new_exclusion}<p>`);
			}
		}
		// show exclusions
		$("#exclusion").fadeIn();
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
		$(".btn").on("click", function() {
			$("#restaurant-name").empty();
			$("#results").empty();
			$("#results").hide();
			$("#map-canvas").hide();

			$(".jumbotron").hide();
			$("#try_again").hide();

			var preferences = exclusion.preferences;
			
			getNearbyRestaurants(loc, preferences).then(function(restaurants) {
				var randomIndex = Math.floor(Math.random() * restaurants.length);
				var restaurant = restaurants[randomIndex];
				
				var splitTypes = restaurant.foodType.split(',');
				
				$("<h2>", {
					id: "result_name",
					text: restaurant.name
				}).appendTo("#restaurant-name");
				
				$("<img>", {
					id: "result_image",
					src: restaurant.image,
				}).appendTo("#results");
				
				$("#results").append("<div class='directionDiv'><a href='https://www.google.com/maps/search/?api=1&query=" + 
									restaurant.lat + 
									"," + restaurant.lon + 
									"' target='_blank'><img class='directions' src='https://image.flaticon.com/icons/svg/109/109738.svg'>" + 
									"Get Directions" +
									"</a></div>");
				
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
				
				// $("<p>", {
				// 	id: "result_description",
				// 	text: restaurant.description
				// }).appendTo("#results");
				
				$("<p>", {
					id: "result_link",
					html: "<a href='" + restaurant.link + "' target='_blank'>" + "see more &raquo;"+ "</a>"
				}).appendTo("#results");

				var displayMap=createGoogleMap({ lat: restaurant.lat, lon: restaurant.lon });
				$("#map-canvas").append(displayMap);
	
				// scroll smoothly to results
				// $([document.documentElement, document.body]).animate({
				// 	scrollTop: $("#results").offset().top
				// }, 1000);

				$("#results").fadeIn();
				$("#map-canvas").fadeIn();
				$("#try_again").fadeIn();
				$("#results_div").fadeIn();
				$('.tooltipped').tooltip();
			});
		});
	}
};