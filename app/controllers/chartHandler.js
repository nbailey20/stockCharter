'use strict';

var companies = [];
var currDate;
var prevDate;

$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "/",
        error: errHandler,
        success: function (data) {
            var choices = data[0].list;
            choices.forEach(function (i) {
               companies.push(i); 
            });
        }
    });
    
    $("#updateChart").on("click", function () {
        var company = $("#company-input").val(); 
        companies.push(company); 
        
        makeAjax();
        $("#loading-text").html("Stock data currently loading...");
        drawBasic();
    });
    
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
    currDate = currYear + "-" + currMonth + "-" + currDay;
    prevDate = eval(currYear-1) + "-" + currMonth + "-" + currDay;
    $("#fromdate").val(prevDate);
    $("#todate").val(currDate);
    
    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(drawBasic); 
    
});


function drawBasic() {
    var stocks = new google.visualization.DataTable();
    stocks.addColumn('string', 'X');
    companies.forEach(function (i) {
        stocks.addColumn('number', i);        
    });

    
    var startdate = $("#fromdate").val();
    if (!startdate.match(/([0-9]{4}-[0-9]{2}-[0-9]{2})/)) {
        alert("Please use a date of the format YYYY-MM-DD");
        startdate = prevDate;
    }
    var enddate = $("#todate").val();
    if (!enddate.match(/([0-9]{4}-[0-9]{2}-[0-9]{2})/)) {
        alert("Please use a date of the format YYYY-MM-DD");
        enddate = currDate;
    }
    
    var chartArr;
    companies.forEach(function (element) {
        var url = "https://www.quandl.com/api/v3/datasets/WIKI/" + element + ".json?column_index=4";
        url += "&start_date=" + startdate + "&end_date=" + enddate + "&collapse=daily&transformation=diff&api_key=vsBU_LCE8RLH9sMNJZgM";
        
        $.ajax({
            type: "GET",
            url: url,
            async: false,
            error: errHandler,
            success: function (data) {
                if (data.dataset.data.length === 0) {
                    
                }
                else {
                    var dataArr = data.dataset.data;
                    if (companies[0] == element) {
                        chartArr = dataArr;
                    }
                    else {
                        //alert(!chartArr);
                        if (!chartArr) {
                            alert("setting chartArr");
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
                
            }
            
        });
        
    });
}


function makeAjax () {
    $.ajax({
       type: "POST", 
       url: "/update",
       data: {list: JSON.stringify(companies)},
       error: errHandler
    });
}


function errHandler(err) {
    alert("Error retrieving data: please reload page.");
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