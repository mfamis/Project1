var APIKEY = "nHKZkRiu2tXKRPBbadE4xrF-Am4zY_ZQL3vIbyBbjkrbLvjeWaFyHm7wLD6KPbE41ZHPBXOno0L-hHMpThJG0CNJvomCZlsnr6VY_evs7Oco6jYioHh6eLtyeltRW3Yx";
var CLIENTID = "ZpCIXNh4sgX0A9egGG6wzA";

/*
$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + APIKEY);
    }
});
*/

var query = "https://api.yelp.com/v3/businesses/search?term=food&latitude=38.577022&longitude=-121.477360";

var ajaxQuery = { 
    url: query, 
    method: "GET",
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + APIKEY);},
}

function yelpResponseHandler(response)
{
    $("#yelp-response-p").text(JSON.stringify(response));
}

$.ajax(ajaxQuery).then(yelpResponseHandler);