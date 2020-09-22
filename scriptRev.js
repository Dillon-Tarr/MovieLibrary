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
        <div class="col-12 col-lg-5 movieContainer">
            <div class="row">
                <div class="col-4" id="poster${data[i].id}"><img src="${data[i].poster}" class="img-fluid posterImg" alt="Movie Poster"></div>
            <div class="col-8">
                <p id="title${data[i].id}">${data[i].title}</p>
                <p id="director${data[i].id}">${data[i].director}</p>
                <p id="genre${data[i].id}">${data[i].genre}</p>
                <p id="rating${data[i].id}">${data[i].rating}</p>
                <p>
                <button class="rateButton" id="addRating${data[i].id}" onclick="rateMovie(${data[i].id})">Rate:</button>&nbsp;
                <input type="text" class ="ratingInput" id="ratingInput${data[i].id}" placeholder="0-10">
                </p>
                <p><span class="updateButtons${data[i].id}"><button class="updateButton" id="updateButton${data[i].id}" onclick="createUpdateFields(${data[i].id})">Update</button>
                <button class="hiddenButton" id="confirmUpdate${data[i].id}" onclick="updateMovie(${data[i].id})">Confirm Update</button><br>
                <button class="hiddenButton" id="cancelUpdate${data[i].id}" onclick="refreshPage()">Cancel Update</button></span></p>
            </div>
            </div>
        </div>`);
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
        return el["title"].toLowerCase().includes(userInput.toLowerCase()) ||
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
    $( `#poster${id}` ).html( `<input type="text" class="inputField" id="posterInput${id}" value="${currentData[id - 1].poster}">` );
    $( `#title${id}` ).html( `<input type="text" class="inputField" id="titleInput${id}" value="${currentData[id - 1].title}">` );
    $( `#director${id}` ).html( `<input type="text" class="inputField" id="directorInput${id}" value="${currentData[id - 1].director}">` );
    $( `#genre${id}` ).html( `<input type="text" class="inputField" id="genreInput${id}" value="${currentData[id - 1].genre}">` );
    $( `#rating${id}` ).html( `Rating : <input type="text" class="ratingInput inputField" id="ratingInput${id}" value="${currentData[id - 1].rating}">` );
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

$("#close").click(function(event) {
    $('.modal').modal('toggle')
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