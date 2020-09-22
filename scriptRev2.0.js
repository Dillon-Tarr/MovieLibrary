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
                <div class="col-5" id="poster${data[i].id}"><img src="${data[i].poster}" class="img-fluid posterImg" alt="Movie Poster"></div>
            <div class="col-7">
                <p id="title${data[i].id}">${data[i].title}</p>
                <p id="director${data[i].id}">${data[i].director}</p>
                <p id="genre${data[i].id}">${data[i].genre}</p>
                <p id="rating${data[i].id}">Rating : ${data[i].ratingData.currentRating}</p>
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
    $( `#poster${id}` ).html( `<input type="text" id="posterInput${id}" value="${currentData[id - 1].poster}">` );
    $( `#title${id}` ).html( `<input type="text" id="titleInput${id}" value="${currentData[id - 1].title}">` );
    $( `#director${id}` ).html( `<input type="text" id="directorInput${id}" value="${currentData[id - 1].director}">` );
    $( `#genre${id}` ).html( `<input type="text" id="genreInput${id}" value="${currentData[id - 1].genre}">` );
    $( `#rating${id}` ).html( `${currentData[id - 1].ratingData.currentRating}` );
}

function updateMovie(id){
    let poster = $( `#posterInput${id}` ).val();
    let title = $( `#titleInput${id}` ).val();
    let director = $( `#directorInput${id}` ).val();
    let genre = $( `#genreInput${id}` ).val();
    let usersRating = $( `#ratingInput${id}` ).val();
    
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

function rateMovie(id){
    let usersRating = parseFloat($( `#ratingInput${id}` ).val());
    if (usersRating > 10){
        usersRating = 10;
    }
    else if (usersRating < 0){
        usersRating = 0;
    }
    let movie;

    $.ajax({
        url: `http://localhost:3000/api/movies/${id}`,
        dataType: "json",
        type: 'GET',
        success: function(data){
            console.log("The first one went through.")
            movie = data;
            let newRating = parseFloat((((movie.ratingData.currentRating * (movie.ratingData.numberOfRatings)) + usersRating) / (movie.ratingData.numberOfRatings + 1)).toFixed(2));
            updateRating(movie, usersRating, newRating);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}

function updateRating(movie, usersRating, newRating){
    movie.ratingData.numberOfRatings++;
    $.ajax({
    url: 'http://localhost:3000/api/movies',
    type: 'PUT',    
    data: `{
        "id": ${movie.id},  
        "poster": "${movie.poster}",
        "title": "${movie.title}",
        "director": "${movie.director}",
        "genre": "${movie.genre}",
        "ratingData": {
            "numberOfRatings": ${movie.ratingData.numberOfRatings},
            "lastRating": ${usersRating},
            "currentRating": ${newRating}
          }
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

/*function undoLastRating(id){
    return `Didn't have time to add this. :(`;
}*/

$("#close").click(function(event) {
    $('.modal').modal('toggle')
});

function addMovie(){
    let poster = $( `#poster` ).val();
    let title = $( `#title` ).val();
    let director = $( `#director` ).val();
    let genre = $( `#genre` ).val();
    let usersRating = $( `#rating` ).val();
    
    $.ajax({
        url: 'http://localhost:3000/api/movies',
        type: 'POST',    
        data: `{  
            "poster": "${poster}",
            "title": "${title}",
            "director": "${director}",
            "genre": "${genre}",
            "usersRating": ${usersRating}
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