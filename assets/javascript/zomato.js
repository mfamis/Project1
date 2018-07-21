var APIKEY = "7e43dd3df445b7aee59f4e05cf1204c7";
var ZOMATO_QUERY_BASE = "https://developers.zomato.com/api/v2.1/search?";

function getZomatoJson(locationObject)
{
    var params = $.param(
        {
            lat: locationObject.latitude,
            lon: locationObject.longitude,
            count: 10,
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

function meetsUserPreferences(listing, preferences)
{
    return true;
}