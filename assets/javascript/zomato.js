var ZOMATO_APIKEY = "7e43dd3df445b7aee59f4e05cf1204c7";
var ZOMATO_QUERY_RESTARAUNT_BASE = "https://developers.zomato.com/api/v2.1/search?";
var ZOMATO_QUERY_CATEGORY_BASE = "https://developers.zomato.com/api/v2.1/categories";
var ZOMATO_QUERY_CUISINE_BASE = "https://developers.zomato.com/api/v2.1/cuisines?";

/**
 * Gets the Zomato API JSON data using a specific location.
 * @param {object} location - The location to search
 * @returns {object} JSON of the Zomato listings
 */
function getZomatoJson(queryBase, location)
{
    var paramsObj = {};
    if (location)
    {
        paramsObj["lat"] = location.latitude;
        paramsObj["lon"] = location.longitude;
    }

    var query = queryBase + $.param(paramsObj);
    console.log("Query: " + query);

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
            headers: { "user-key": ZOMATO_APIKEY },
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
    var zomatoJson = getZomatoJson(ZOMATO_QUERY_RESTARAUNT_BASE, location);
    
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
 * 
 * preferences = {
 *     excludedCuisines = [ ], // array of strings of cuisines to exclude
 * }
 * 
 * @param {object} listing - JSON data of specific restaurant listing
 * @param {object} preferences - User preferences for restaurants
 * @returns Boolean of whether or not restaurant meets user preferences
 */
function meetsUserPreferences(listing, preferences)
{
    for(excludedCuisineIndex in preferences.excludedCuisines)
    {
        var excludedCuisine = preferences.excludedCuisines[excludedCuisineIndex];
        if(listing.cuisines.indexOf(excludedCuisine) != -1)
        {
            return false;
        }
    }
    return true;
}

/**
 * Get all of the categories available on Zomato
 * @returns List of category names (such as "Delivery")
 */
function getAllCategories()
{
    var zomatoJson = getZomatoJson(ZOMATO_QUERY_CATEGORY_BASE);
    
    var outputCategories = [];
    for (zomatoIndex in zomatoJson.categories)
    {
        var zomatoListing = zomatoJson.categories[zomatoIndex].categories;
        outputCategories.push(zomatoListing.name);
    }

    return outputCategories;
}

/**
 * Get all of the cuisines available nearby
 * @returns List of cuisine names (such as "Mexican")
 */
function getNearbyCuisines(location)
{
    var zomatoJson = getZomatoJson(ZOMATO_QUERY_CUISINE_BASE, location);
    console.log(zomatoJson);

    var outputCuisines = [];
    for (zomatoIndex in zomatoJson.cuisines)
    {
        var zomatoListing = zomatoJson.cuisines[zomatoIndex].cuisine;
        outputCuisines.push(zomatoListing.cuisine_name);
    }

    return outputCuisines;
}