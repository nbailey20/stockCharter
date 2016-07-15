'use strict';

var update = true;

$(document).ready(function () {
   setTimeout(displayCompanies, 500);
   
   var socket = io.connect('/');
    socket.on('dataremoved', function (data) {
        update = false;
        $("#" + data.id).click();
    });
   
   $("#updateChart").on("click", function () {
      displayCompanies(); 
   });
   
   $("#company-list").on("click", function (event) {
       if (update) {
            socket.emit("dataremoved", {id: event.target.id});
       }
        else {
            update = true;
        }
       
        var name = event.target.id; 
        var index = companies.indexOf(name);
        if (index > -1) {
            var temp1 = companies.slice(0, index);
            var temp2 = companies.slice(index+1, companies.length);
            companies = temp1.concat(temp2);
            displayCompanies();
            makeAjax();
            drawBasic();
        }
   });
   
});


function displayCompanies () {
    var html = "";
    for (var i = 0; i < companies.length; i += 3) {
        html += '<div class="row company-row"><div class="col-xs-3"><button id="' + companies[i] + '" class="exit btn bt-danger">';
        html += '<span>x</span></button><p class="company-name">' + companies[i] + '</p></div>';
        
        if (i+1 < companies.length) {
            html += '<div class="col-xs-3"><button id="' + companies[i+1] + '" class="exit btn bt-danger">';
            html += '<span>x</span></button><p class="company-name">' + companies[i+1] + '</p></div>';
        }
        else {
            html += '</div>';
            break;
        }
        
        if (i+2 < companies.length) {
            html += '<div class="col-xs-3"><button id="' + companies[i+2] + '" class="exit btn bt-danger">';
            html += '<span>x</span></button><p class="company-name">' + companies[i+2] + '</p></div></div>';
        }
        else {
            html += '</div';
        }
    }
    $("#company-list").html(html);
    $("#company-input").val("");
}