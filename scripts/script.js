
var data_url = './data/votes_data.csv' //url of data file
//var data = {"counties":[]}
var result = {}
var headers = [
    {"label":"District", "value":"ajc_precinct"},
    {"label":"Democratic", "value":"dem_votes"},
    {"label":"Republican", "value":"rep_votes"},
    {"label":"Average Income", "value":"avg_income"}
]
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


var updateSelect = function(data) {
    var select = document.getElementById('inputCounty')
    console.log(this.data)
    for (var county in data["counties"]) {
        console.log(county)
        var opt = document.createElement('option');
        opt.value = data.counties[county].fips;
        opt.innerHTML = data.counties[county].name;
        select.appendChild(opt)
    }
}
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
    return arrayToObject(headers, lines)
}

//Processes from this array to an object
var arrayToObject = function(headers, input) {
    var data = {"counties":[]} 
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

        var index = countyExist(data.counties, county['fips'])
        if (index != -1) {
            data.counties[index]['precincts'].push(temp)
        } else {
            county['precincts'] = [] 
            county['precincts'].push(temp)
            data.counties.push(county)
        }

    }
    return data

}

var countyExist = function(obj, county) {
    var result
    if (obj) {
        result = obj.findIndex(function(element) {
            return element.fips == county
        })
    }
    return result
}

var getResult = function(num) {
    var index = countyExist(result.counties,num)
    var county;
    if (index) {
        county = result.counties[index]
        console.log("hi" + index)
        console.log("You are viewing the results for " + toProperCase(county.name))
        $(".county-title").html("You are viewing the results for " + toProperCase(county.name) + " County.")
        if (county.precincts.length > 0) {
            console.log("there are results")
            $(".precincts").append("<table><thead>")
            for (var h in headers) {
                $(".precincts").append("<td>" + headers[h].label + "</td>")
            }
            $(".precincts").append("</thead><tbody>")
            var body = "<tbody>"
            for (var l in county.precincts) {
                body = body + "<tr>"
                for (var h in headers) {
                    body = body + "<td>"
                    body = body + county.precincts[l][headers[h].value]
                    body = body + "</td>"
                }
                body = body + "</tr>"
            }
            body = body + "</tbody></table>"
            $(".precincts").append(body)
        } else {
            $(".county-title").html("Result for this " + county.name +" are not available yet")
        }
    } else {
        $(".county-title").html("Result for this county cannot be found")
    }
    console.log(county)
    //$("#county-title").innerHTML = ""
}

var getCounty = function(fips) {
    for (var m in result) {
        if (result.counties[m].fips = fips) {
            return result.counties[m]
        } 
    }
}

var toProperCase = function(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

//On load opens csv
$(document).ready(function() {
    $(".county-title").html("")
    $(".precincts").html("")
    $.ajax({
        beforeSend: function() {
            document.body.style.cursor='wait';
        },
        type: "GET",
        url: data_url,
        dataType: "text",
        success: function(stuff) { 
            data = processData(stuff); 
            updateSelect(data)
            result = data
            document.body.style.cursor='default';
        }
    });
    $("#county-select").submit(function(e) {
        e.preventDefault()
        $(".county-title").html("")
        $(".precincts").html("")
        $( "#county-select option:selected" ).val();
        var value = $("#county-select option:selected").val();
        getResult(value)
        console.log("FIPS " + value)
    })

});
//Adds listener for county select button
