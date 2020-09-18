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
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    });
});

function buildTable(data){
    var $jsonData = $('#jsonData');
    var songTemplate = "" +
    "<tr>" +
    '<td scope="col"><span class="updateButtons{{id}}"><button class="updateButton" id="updateButton{{id}}" onclick="createUpdateFields({{id}})">Update</button>' +
    '<button class="hiddenButton" id="confirmUpdate{{id}}" onclick="updateMovie({{id}})">Confirm Update</button><br>' +
    '<button class="hiddenButton" id="cancelUpdate{{id}}" onclick="refreshPage()">Cancel Update</button></span></td>' +
    '<td class="w-25" id="poster{{id}}"><img src="{{poster}}" class="img-fluid posterImg" alt="Movie Poster"></td>' +        
    '<td id="title{{id}}">{{title}}</td>' +
    '<td id="director{{id}}">{{director}}</td>' +
    '<td id="genre{{id}}">{{genre}}</td>'
    "</tr>";

    $.each(data, function(i, jsonData) {
        $jsonData.append(Mustache.render(songTemplate, jsonData));
    });
}

// function filterResults(currentData, th, str){
//     var newResults = $(currentData).filter(function(i) {
//         return currentData[i][th] === str;
//     });
//     $("#jsonData > tr").remove();
//     buildTable(newResults);
// }


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

function createUpdateFields(id){
    $( `#updateButton${id}` ).css( "display", "none" );
    $( `#confirmUpdate${id}` ).css( "display", "initial" );
    $( `#cancelUpdate${id}` ).css( "display", "initial" );
    $( `#poster${id}` ).html( `<input type="text" id="posterInput${id}" value="${currentData[id - 1].poster}">` );
    $( `#title${id}` ).html( `<input type="text" id="titleInput${id}" value="${currentData[id - 1].title}">` );
    $( `#director${id}` ).html( `<input type="text" id="directorInput${id}" value="${currentData[id - 1].director}">` );
    $( `#genre${id}` ).html( `<input type="text" id="genreInput${id}" value="${currentData[id - 1].genre}">` );
}

function updateMovie(id){
    let poster = $( `#posterInput${id}` ).val();
    let title = $( `#titleInput${id}` ).val();
    let director = $( `#directorInput${id}` ).val();
    let genre = $( `#genreInput${id}` ).val();
    
    $.ajax({
        url: 'http://localhost:3000/api/movies',
        type: 'PUT',    
        data: `{
            "id": ${id},  
            "poster": "${poster}",
            "title": "${title}",
            "director": "${director}",
            "genre": "${genre}"
          }`,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            console.log(result);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
        complete: function(){
            setTimeout(refreshPage, 1500);
        }
    }); 
}
$("#addButton").click(function(event) {
    $(`.bg-modal`).css("display", "flex");
});

$("#close").click(function(event) {
    $(`.bg-modal`).css("display", "none");
});

function createAddFields(){
    $(`.movieInputRow`).css("display", "initial");
    $(`#addButton`).css("display", "none");
    $(`#movieInputRowROW td`).css({"line-height": "initial", "padding": "initial"})
}

function addMovie(){
    let poster = $( `#poster` ).val();
    let title = $( `#title` ).val();
    let director = $( `#director` ).val();
    let genre = $( `#genre` ).val();
    
    $.ajax({
        url: 'http://localhost:3000/api/movies',
        type: 'POST',    
        data: `{  
            "poster": "${poster}",
            "title": "${title}",
            "director": "${director}",
            "genre": "${genre}"
          }`,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            console.log(result);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
        complete: function(){
            setTimeout(refreshPage, 1500);
        }
    }); 
}