var APIKEY = "7e43dd3df445b7aee59f4e05cf1204c7";

function getNearbyRestaraunts(locationObject)
{
    var queryBase = "https://developers.zomato.com/api/v2.1/search?";
    var params = $.param(
        {
            lat: locationObject.latitude,
            lon: locationObject.longitude,
            count: 10,
        }
    );
    var query = queryBase + params;

    var restarauntIdData = false;
    $.ajax(
        {
            method: "GET",
            crossDomain: true,
            url: query,
            dataType: "json",
            async: false,
            success: function (result) {
                console.log(result);
                restarauntIdData = result; 
            },
            headers: { "user-key": APIKEY },
        }
    );

    return restarauntIdData;
}

var sampleLocationData = { latitude: 37.79161, longitude: -122.42143 };
var sampleRestarauntData = getNearbyRestaraunts(sampleLocationData);
console.log(sampleRestarauntData);