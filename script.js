$(document).ready(function() {

    var currentData = null;
    var th = "";

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

    function buildTable(data){
        var $jsonData = $('#jsonData');
        var songTemplate = "" +
        "<tr>" +
        "<td>{{poster}}</td>" +        
        "<td>{{title}}</td>" +
        "<td>{{director}}</td>" +
        "<td>{{genre}}</td>"
        "</tr>";

        $.each(data, function(i, jsonData) {
            $jsonData.append(Mustache.render(songTemplate, jsonData));
        });
    };

    function filterResults(currentData, th, str){
        var newResults = $(currentData).filter(function(i) {
            return currentData[i][th] === str;
        });
        $("#jsonData > tr").remove();
        buildTable(newResults);
    };

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

    // $("#reset").click(function(){
    //     window.location.reload();
    // });

    // $("#title").click(function(event) {
    //     th = "title";
    //     inputSearch(th);
    // });

    // $("#album").click(function(event) {
    //     th = "album";
    //     inputSearch(th);
    // });

    // $("#artist").click(function(event) {
    //     th = "artist";
    //     inputSearch(th);
    // });

    // $("#genre").click(function(event) {
    //     th = "genre";
    //     inputSearch(th);
    // });

    // $("#releaseDate").click(function(event) {
    //     th = "releaseDate";
    //     inputSearch(th);
    // });

});