/**
 * Used alongside the test-zomato.html page. This javascript performs
 * a test of the zomato javascript by selecting restaurants at a
 * random San Francisco location.
 */
$(document).ready(
    function()
    {
        var sampleLocationData = { latitude: 37.79161, longitude: -122.42143 };
        var sampleRestaurantData = getNearbyRestaurants(sampleLocationData);
        console.log(sampleRestaurantData);
        
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
