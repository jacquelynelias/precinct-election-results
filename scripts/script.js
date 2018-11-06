var data_url = './data/votes_data.csv'
var data = {}

/*
data = {
    counties: [
        {
            county: 'Fulton'
            precincts: [{}]
        }
    ]
]
    county: 
    precincts{

    }
]
}
*/

//On load opens csv
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: data_url,
        dataType: "text",
        success: function(data) { data = processData(data);}
     });
});

var processData = function(data) {
    return csvToArray(data)
}
var csvToArray = function(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(data[j]);
            }
            lines.push(tarr);
        }
    }    
    console.log(headers)
    console.log(lines)
    arrayToObject(headers, lines)
}

var arrayToObject = function(headers, input) {

}

document.getElementById("county-select").addEventListener("submit", function() {
    console.log("clicked")
});