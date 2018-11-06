
var data_url = './data/votes_data.csv' //url of data file
var data = {"counties":[]}

/*
data = {
    counties: [
        {
            county: 'Fulton',
            fips: #,
            precincts: [{}]
        }
    ]
]
}
*/

//On load opens csv
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: data_url,
        dataType: "text",
        success: function(stuff) { data = processData(stuff);}
     });
     console.log(data)
});

//Calls functions to take data from csv to an object
var processData = function(data) {
    return csvToArray(data)
}

//Processes from the csv to an array of headers and items
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
    arrayToObject(headers, lines)
}

//Processes from this array to an object
var arrayToObject = function(headers, input) {
    for (var item in input) {
        var temp = {}
        var county = {}
        county['name'] = input[item][10]
        county['fips'] = input[item][11]
        for (var m in headers) {
            var ignore = [9,10,11,15,19]
            if (!ignore.includes(parseInt(m))) {
                temp[headers[m]] = input[item][m]
            }
        }

        var index = countyExist(data.counties, county['name'])
        if (index != -1) {
            data.counties[index].precincts.push(temp)
        } else {
            county['precincts'] = [] 
            county['precincts'].push(temp)
            data.counties.push(county)
        }

    }

}

var countyExist = function(obj, county) {
    var result
    if (obj) {
        result = obj.findIndex(function(element) {
            return element.name == county
        })
    }
    return result
}

//Adds listener for county select button
document.getElementById("county-select").addEventListener("submit", function() {
    console.log("clicked")
});