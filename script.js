var currentData = null;
var th = "";

$(document).ready(function() {

    $(function (){

        $.ajax({
            url: 'http://localhost:3000/api/movies',
            dataType: "json",
            type: 'GET',
            success: function(data){
                currentData = data;
                console.log(data);
                buildTable(currentData);
            }
        });
    });
});

function buildTable(data){
    var $jsonData = $('#jsonData');
    var songTemplate = "" +
    "<tr>" +
    '<td scope="col"><span id="updateButtons{{id}}"><button class="updateButton" id="updateButton{{id}}" onclick="clickEvent({{id}})">Update</button>' +
    '<button class="hiddenButton confirmButton" id="confirmUpdate{{id}}" onclick="clickEvent({{id}})">Confirm Update</button>' +
    '<button class="hiddenButton cancelButton" id="cancelUpdate{{id}}" onclick="refreshPage()">Cancel Update</button></span></td>' +
    '<td class="w-25" id="poster{{id}}"><img src="{{poster}}" class="img-fluid posterImg" alt="Movie Poster"></td>' +        
    '<td id="title{{id}}">{{title}}</td>' +
    '<td id="director{{id}}">{{director}}</td>' +
    '<td id="genre{{id}}">{{genre}}</td>'
    "</tr>";

    $.each(data, function(i, jsonData) {
        $jsonData.append(Mustache.render(songTemplate, jsonData));
    });
}

function filterResults(currentData, th, str){
    var newResults = $(currentData).filter(function(i) {
        return currentData[i][th] === str;
    });
    $("#jsonData > tr").remove();
    buildTable(newResults);
}


// function inputSearch(th){
//     $("#" + th).empty();
//     $("#" + th + "Input").fadeIn();
//     $("#btn").fadeIn();
//     $("#reset").fadeIn();
//     $("#btn").click(function(){
//         var str = $("#" + th + "Input").val();
//         filterResults(currentData, th, str);
//     });
// };

function refreshPage(){
    window.location.reload();
}



function clickEvent(id){
console.log("hello " + id);
$( `#updateButton${id}` ).css( "display", "none" );
$( `#confirmUpdate${id}` ).css( "display", "initial" );
$( `#cancelUpdate${id}` ).css( "display", "initial" );
$( `#poster${id}` ).html( `<input type="text" value="${currentData[id - 1].poster}">` );
$( `#title${id}` ).html( `<input type="text" value="${currentData[id - 1].title}">` );
$( `#director${id}` ).html( `<input type="text" value="${currentData[id - 1].director}">` );
$( `#genre${id}` ).html( `<input type="text" value="${currentData[id - 1].genre}">` );
}