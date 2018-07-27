// hides the div when we click on get started button
$(".questions").hide();

$().ready(function () {
	loc.getLocation();
	exclusion.getStored();
	page.setFindClick();
	
	$(".start").on("click", function () {
		$(".jumbotron").hide();
		$(".questions").fadeIn();
	});
	
	$("#findfood").on("click", function() {
		$(".questions").hide();
		$("#results").fadeIn();
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
		$("#findfood").click(function() {
			$("#results").empty();
			$("#results").hide();

			var preferences = exclusion.preferences;
			
			getNearbyRestaurants(loc, preferences).done(
				function (restaurants)
				{
					var randomIndex = Math.floor(Math.random() * restaurants.length);
					var restaurant = restaurants[randomIndex];
					
					var splitTypes = restaurant.foodType.split(',');
					
					$("<h2>", {
						id: "result_name",
						text: restaurant.name
					}).appendTo("#results");
					
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
						text: restaurant.link
					}).appendTo("#results");
					
					createGoogleMap({ lat: restaurant.lat, lon: restaurant.lon });
		
					$("#map-canvas").appendTo("#results");
		
					$("#results").show();

					// scroll smoothly to results
					$([document.documentElement, document.body]).animate({
						scrollTop: $("#results").offset().top
					}, 1000);
				}
			);
		});
	}
};