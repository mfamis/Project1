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

// namespace object for location functions
var loc = {
	lat: null,
    lon: null,

	// get user's location if browser 
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

// namespace object 
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
	addTypeListener: function() {
		$("#resultType").one("click", function() {
			var type = $(this).data("type");
			var index = localStorage.length + 1;

			localStorage.setItem(`stored_${index}`, type);
			console.log(`stored: ${type}`);
		})
	}
};

var page = {
	setFindClick: function() {
		$("#findfood").click(function() {
			var preferences = exclusion.preferences;

			var restaurants = getNearbyRestaurants(loc, preferences);
			var randomIndex = Math.floor(Math.random() * restaurants.length);
			var restaurant = restaurants[randomIndex];
		
			var resultsBody = $("<div>");

			$("<h2>", {
				id: "resultName",
				text: restaurant.name
			}).appendTo("#results");

			$("<img>", {
				id: "resultImage",
				src: restaurant.image,
				"max-width": "500px"
			}).appendTo("#results");

			$("<p>", {
				id: "resultType",
				text: restaurant.foodType,
				"data-type": restaurant.foodType
			}).appendTo("#results");
			exclusion.addTypeListener();

			$("<p>", {
				id: "resultDescription",
				text: restaurant.description
			}).appendTo("#results");

			$("<p>", {
				id: "resultLink",
				text: restaurant.link
			}).appendTo("#results");
		});
	}
};

/*
	NEED TO FIX:
	- result type will be appended before other elements
*/

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