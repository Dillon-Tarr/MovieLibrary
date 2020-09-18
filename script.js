var currentData = null;

$(document).ready(function() {

    $(function (){

        $.ajax({
            url: 'http://localhost:3000/api/movies',
            dataType: "json",
            type: 'GET',
            success: function(data){
                currentData = data;
                console.log('Here is the data retrieved from the initial GET request:', data);
                buildTable();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    });
});

function buildTable(filter = false){
    $('#table-data').html('');
    let data;

    if(filter === true){
        data = filterMovies();
        if (data.length === 0){
            alert('No movies matched your search. Please try again.');
            data = currentData;
        }
    }
    else if (filter === false){
        data = currentData;
    }
    else {
        console.log("Something went very wrong with buildTable() in script.js.")
    }

    for(let i = 0; i < data.length; i++){
        $("#table-data").append(`
        <tr>
            <td scope="col"><span class="updateButtons${data[i].id}"><button class="updateButton" id="updateButton${data[i].id}" onclick="createUpdateFields(${data[i].id})">Update</button>
                <button class="hiddenButton" id="confirmUpdate${data[i].id}" onclick="updateMovie(${data[i].id})">Confirm Update</button><br>
                <button class="hiddenButton" id="cancelUpdate${data[i].id}" onclick="refreshPage()">Cancel Update</button></span></td>
            <td class="w-25" id="poster${data[i].id}"><img src="${data[i].poster}" class="img-fluid posterImg" alt="Movie Poster"></td>
            <td id="title${data[i].id}">${data[i].title}</td>
            <td id="director${data[i].id}">${data[i].director}</td>
            <td id="genre${data[i].id}">${data[i].genre}</td>
        </tr>`);
    }
}

function filterMovies(){
    let dataToFilter = [...currentData];
    let filterBy = $('#searchBox').val();
    if (filterBy === ""){
        return [];
    }
    let filteredData = myFilter(dataToFilter, filterBy);
    return filteredData;
}
  
function myFilter(array, userInput){
    return array.filter(function(el) {
        return el["poster"].toLowerCase().includes(userInput.toLowerCase()) ||
        el["title"].toLowerCase().includes(userInput.toLowerCase()) ||
        el["director"].toLowerCase().includes(userInput.toLowerCase()) ||
        el["genre"].toLowerCase().includes(userInput.toLowerCase());
    }
)}

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