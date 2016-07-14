'use strict';

var companies = [];

$(document).ready(function () {
    $("#updateChart").on("click", function () {
        companies = [];
        var companyArr = $("#company-input").val().split(" "); 
        companyArr.forEach(function (i) {
           companies.push(i); 
        });
        $("#loading-text").html("Stock data currently loading...");
        drawBasic();
    });
    
    companies.push("FB");
    
    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(drawBasic); 
    
});


function drawBasic() {
    var stocks = new google.visualization.DataTable();
    stocks.addColumn('string', 'X');
    companies.forEach(function (i) {
        stocks.addColumn('number', i);        
    });

    var chartArr;
    var d = new Date(); 
    var currDay = d.getDate();
    if (currDay < 10) {
        currDay = "0" + currDay;
    }
    var currMonth = d.getMonth();
    if (currMonth < 9) {
        currMonth = "0" + eval(currMonth+1);
    }
    else {
        currMonth = currMonth+1;
    }
    var currYear = d.getFullYear();
    var currDate = currYear + "-" + currMonth + "-" + currDay;
    var prevDate = eval(currYear-1) + "-" + currMonth + "-" + currDay;
    
    companies.forEach(function (element) {
        var url = "https://www.quandl.com/api/v3/datasets/WIKI/" + element + ".json?column_index=4";
        url += "&start_date=" + prevDate + "&end_date=" + currDate + "&collapse=daily&transformation=diff&api_key=vsBU_LCE8RLH9sMNJZgM";
        
        
        $.ajax({
            type: "GET",
            url: url,
            async: false,
            error: errHandler,
            success: function (data) {
                var dataArr = data.dataset.data;
                if (companies[0] == element) {
                    chartArr = dataArr;
                }
                else {
                    var i = 0;
                    chartArr.forEach(function (item) {
                        // case where both data sets have the data
                        if (dataArr[i][0] == item[0]) {
                            item.push(dataArr[i][1]);
                            if (i < dataArr.length-1)
                                i++;
                        }
                        else {
                            var chartAfter = compareDate(item[0], dataArr[i][0]);
                            // case where dataArr doesn't have date, push next dataArr value into chartArr
                            if (chartAfter) {
                                item.push(dataArr[i][1]);
                            }
                             //case where chartArr doesn't have data, skip extra entry(s) in dataArr;
                            else {
                                if (i == dataArr.length-1)
                                    item.push(dataArr[i][1]);
                                else {
                                    while (compareDate(dataArr[i][0], item[0])) {
                                        i++;
                                    }
                                    item.push(dataArr[i][1]);
                                }
                            }
                        }
                    });
                }
                
                if (companies[companies.length-1] == element) {
                    
                    stocks.addRows(chartArr.reverse());
                    var options = {
                        height: 500,
                        backgroundColor: "darkgray",
                        selectionMode: 'multiple',
                        focusTarget: 'category',
                        vAxis: {
                            title: '%'
                        },
                        hAxis: {
                            title: "Past Year Values",
                                textPosition: "none"
                        }
                    };
                    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
                    chart.draw(stocks, options);
                    $("#loading-text").html("");
                }
            }
            
        });
        
    });
   
    
            
    
}



function errHandler(err) {
    alert(err);
}


// simple helper to return TRUE if the date in string1 
//   comes after the date in string2, FALSE otherwise
// date format: 'YYYY-MM-DD'
function compareDate(string1, string2) {
    var year1 = string1.substr(0,4);
    var year2 = string2.substr(0,4);
    var month1 = string1.substr(5, 7);
    var month2 = string2.substr(5,7);
    var day1 = string1.substr(8,10);
    var day2 = string2.substr(8,10);
    if (parseInt(year1,10) > parseInt(year2, 10)) {
        return true;
    }
    else if (parseInt(month1, 10) > parseInt(month2, 10) && parseInt(year1, 10) == parseInt(year2, 10)) {
        return true;
    }
    else if (parseInt(day1, 10) > parseInt(day2, 10) && parseInt(month1, 10) == parseInt(month2, 10) && parseInt(year1, 10) == parseInt(year2, 10)) {
        return true;
    }
    else {
        return false;
    }
}