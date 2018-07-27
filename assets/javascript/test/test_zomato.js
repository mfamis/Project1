/**
 * Used alongside the test-zomato.html page. This javascript performs
 * a test of the zomato javascript by selecting restaurants at a
 * random San Francisco location.
 */
$(document).ready(
    function()
    {
        var sampleLocationData = { lat: 37.79161, lon: -122.42143 };
        var sampleCuisineData = getNearbyCuisines(sampleLocationData);
        var samplePreferences = {};
        samplePreferences["excludedCuisines"] = [];
        samplePreferences["radius"] = "2000";
        console.log(sampleCuisineData);

        /*
        <label>
            <input type="checkbox" class="meat" />
            <span>Meat</span>
        </label>
        */
        getNearbyCuisines(sampleLocationData, samplePreferences).done(
            function(sampleCuisineData)
            {
                for(cuisineIndex in sampleCuisineData)
                {
                    var cuisine = sampleCuisineData[cuisineIndex];
                    var cuisineLabel = $("<label>");
                    var cuisineInput = $("<input>");
                    cuisineInput.attr("type", "checkbox");
                    cuisineInput.addClass("cuisine-checkbox");
                    cuisineInput.data("cuisine-name", cuisine);
                    var cuisineSpan = $("<span>").text(cuisine);
                    cuisineLabel.append(cuisineInput, cuisineSpan);
                    $("#zomato-cuisine-checkboxes").append(cuisineLabel)
                }
            }
        );

        
        function updateRestarauntTable()
        {
            getNearbyRestaurants(sampleLocationData, samplePreferences).done(
                function(sampleRestaurantData)
                {
                    console.log(sampleRestaurantData);
                    $("#zomato-response-tbody").html("");
                    for(restaurantIndex in sampleRestaurantData)
                    {
                        var restaurant = sampleRestaurantData[restaurantIndex];
                        var restaurantRow = $("<tr>");
                        restaurantRow.append($("<td>").text(restaurant.name));
                        restaurantRow.append($("<td>").text(restaurant.foodType));
                        restaurantRow.append($("<td>").text(restaurant.description));
                        restaurantRow.append($("<td>").text(restaurant.link));
        
                        var img = $("<img>");
                        img.attr("src", restaurant.image);
                        img.attr("width", 100);
                        restaurantRow.append($("<td>").html(img));
        
                        $("#zomato-response-tbody").append(restaurantRow);
                    }
                }
            );
        }
        updateRestarauntTable();

        // Update restaurant listings based on which cuisine boxes are changed
        $(document).on("change", ".cuisine-checkbox",
            function() {
                var cuisine = $(this).data("cuisine-name");
                if($(this).is(":checked")) 
                {
                    samplePreferences.excludedCuisines.push(cuisine);
                    updateRestarauntTable();
                    console.log("Excluding " + cuisine);
                }
                else
                {
                    var i = samplePreferences.excludedCuisines.indexOf(cuisine);
                    samplePreferences.excludedCuisines.splice(i, 1);
                    updateRestarauntTable();
                    console.log("Re-adding " + cuisine);
                }      
            }
        );
    }
);

