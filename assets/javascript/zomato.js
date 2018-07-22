var APIKEY = "7e43dd3df445b7aee59f4e05cf1204c7";
var ZOMATO_QUERY_BASE = "https://developers.zomato.com/api/v2.1/search?";

/**
 * Gets the Zomato API JSON data using a specific location.
 * @param {object} location - The location to search
 * @returns {object} JSON of the Zomato listings
 */
function getZomatoJson(location)
{
    var params = $.param(
        {
            lat: location.latitude,
            lon: location.longitude,
        }
    );
    var query = ZOMATO_QUERY_BASE + params;

    var listingData = false;
    $.ajax(
        {
            method: "GET",
            crossDomain: true,
            url: query,
            dataType: "json",
            async: false,
            success: function (result) {
                console.log(result);
                listingData = result; 
            },
            headers: { "user-key": APIKEY },
        }
    );

    return listingData;
}

/**
 * Gets the nearby restaurants (using location), checks if they meet
 * user preferences (using preferences), and formats the data to
 * our projects expectations.
 * @param {object} location - The location to search
 * @param {object} preferences - The preferences to compare against
 * @returns Array of restaurant objects, per project specifications
 */
function getNearbyRestaurants(location, preferences)
{
    var zomatoJson = getZomatoJson(location);
    
    var outputRestaurants = [];
    for (zomatoIndex in zomatoJson.restaurants)
    {
        var zomatoListing = zomatoJson.restaurants[zomatoIndex].restaurant;
        if (meetsUserPreferences(zomatoListing, preferences))
        {
            var restaurant = {};
            restaurant["name"] = zomatoListing.name;
            restaurant["foodType"] = zomatoListing.cuisines;
            restaurant["image"] = zomatoListing.featured_image;
            restaurant["description"] = "DIDN'T FIND THIS";
            restaurant["link"] = zomatoListing.url;

            outputRestaurants.push(restaurant);
        }
    }

    return outputRestaurants;
}

/**
 * Checks if the selected restaurant meets the user preferences.
 * Until we decide on how preferences work, this will always return
 * true.
 * @param {object} listing - JSON data of specific restaurant listing
 * @param {*} preferences - User preferences for restaurants
 */
function meetsUserPreferences(listing, preferences)
{
    return true;
}