
var data_url = './data/votes_concat.csv' //url of data file
//var data = {"counties":[]}
var result = {}
var headers = [
    {"label":"Precinct", "value":"Precinct"},
    {"label":"Results", "value":"votes"},
    {"label":"Total Votes", "value":"total"}
]
var lineWidth = 8;

var candidates = ["abrams", "kemp", "metz"]; //put names of candidates here
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
    for (var county in data["counties"]) {
        var opt = document.createElement('option');
        opt.value = data.counties[county].name;
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
        county['name'] = input[item][1];
        //county['fips'] = input[item][11]
        for (var m in headers) {
            var ignore = [5]
            if (!ignore.includes(parseInt(m))) {
                temp[headers[m]] = input[item][m]
            }
        }

        var index = countyExist(data.counties, county['name'])
        if (index != -1) {
          data.counties[index]['precincts'].push(temp);
        } else {
            county['precincts'] = [] 
            county['precincts'].push(temp);
            data.counties.push(county)
        }

    }
    return data

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

var getResult = function(num) {
    var index = countyExist(result.counties,num)
    var county;
    if (index >= 0) {
        county = result.counties[index]
        $(".county-title").html("<h1>" + toProperCase(county.name) + " COUNTY</h1>")
        if (county.precincts.length > 0) {
            var body = "<table id='table-results' class='table table-striped table-hover'><thead>"
            for (var h in headers) {
               body = body +"<td>" + headers[h].label + "</td>"
            }
            body = body + "</thead>"
            body = body + "<tbody>"
            for (var l in county.precincts) {
                body = body + "<tr>"
                for (var h in headers) {
                    body = body + "<td>"
                    if(headers[h].value === 'Precinct') {
                        body = body + toProperCase(county.precincts[l][headers[h].value])

                    } else if (headers[h].value === 'total') {
                        var total = 0;
                        for (var n in candidates) {
                            console.log(candidates[n])
                            console.log(county.precincts[l][candidates[n]])
                            total = total + parseInt(county.precincts[l][candidates[n]+'_votes'])

                        }
                        body = body + wCommas(total)
                        
                    } else if (headers[h].value === 'votes') {
                        body = body + "<div class='dem'><div class='dem-text'><h4>"+toProperCase(candidates[0])+":</h4> <p>" + (county.precincts[l][candidates[0] +'_votes'] ? wCommas(county.precincts[l][candidates[0] +'_votes'].split(".")[0]) : 'N/A') + "</p></div><div class='dem-rect' style='width:" + parseInt(county.precincts[l][candidates[0] +'_votes'])/lineWidth+"px'></div></div>"
                        body = body + "<div class='rep'><div class='rep-text'><h4>"+toProperCase(candidates[1])+":</h4> <p>" + (county.precincts[l][candidates[1] +'_votes'] ? wCommas(county.precincts[l][candidates[1] +'_votes'].split(".")[0]) : 'N/A') + "</p></div><div class='rep-rect' style='width:" +parseInt(county.precincts[l][candidates[1] +'_votes'])/lineWidth +"px'></div></div></div>"
                        body = body + "<div class='lib'><div class='lib-text'><h4>"+toProperCase(candidates[2])+":</h4> <p>" + (county.precincts[l][candidates[2] +'_votes'] ? wCommas(county.precincts[l][candidates[2] +'_votes'].split(".")[0]) : 'N/A') + "</p></div><div class='lib-rect' style='width:" +parseInt(county.precincts[l][candidates[2] +'_votes'])/lineWidth +"px'></div></div></div>"

                    } else if (headers[h].value === 'f') {
                        
                    } else {
                        body = body + county.precincts[l][headers[h].value]
                    }
                    
                    body = body + "</td>"
                }
                body = body + "</tr>"
            }
            body = body + "</tbody></table>"
            $(".precincts").append(body)
            styleTable()
            $(".precincts").append("<p id='footer'>Data is from the Georgia Secretary of State</p>")
            
        } else {
            $(".county-title").html("Result for this " + county.name +" are not available yet")
        }
    } else {
        $(".county-title").html("Result for this county cannot be found")
    }
    //$("#county-title").innerHTML = ""
}

var getCounty = function(fips) {
    for (var m in result) {
        if (result.counties[m].fips = fips) {
            return result.counties[m]
        } 
    }
}

var styleTable = function() {
    var table = $('#table-results')
    table.DataTable( {
        "columnDefs": [{
            "targets":[1],
            "orderable": false

        }],
        "autoWidth": false,
        "columns": [
            { "type": "string" },
            { "type": "num-fmt", "className":"dt-body-left"},
            { "type": "num-fmt" }
        ]
    });    
}

var wCommas = function(str) {
    return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

var toProperCase = function(str) {
  if(str){
    return str.toUpperCase();
    //return str.replace(/\w\S*/g, function(txt) {
      //return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    //});
  } else {
    return "";
  }
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
    })

    $("#inputCounty").change(function(e) {
        e.preventDefault();
        $("input[type=submit]").removeAttr("disabled");

    })

});
//Adds listener for county select button
