var APIKEY = "7e43dd3df445b7aee59f4e05cf1204c7";
/*
$.ajax(
    {
        method: "GET",
        crossDomain: true,
        url: "https://developers.zomato.com/api/v2.1/search?count=10&lat=37.79161&lon=-122.42143",
        dataType: "json",
        async: true,
        headers: { "user-key": APIKEY },
    }).then(function(r) {console.log(r);});
*/

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
            async: true,
            headers: { "user-key": APIKEY },
        }
    ).then(function(response) 
        { 
            restarauntIdData = response; 
            console.log(response);
        }
    );  

    return restarauntIdData;
}

var sampleLocationData = { latitude: 37.79161, longitude: -122.42143 };
var sampleRestarauntData = getNearbyRestaraunts(sampleLocationData);
console.log(sampleRestarauntData);