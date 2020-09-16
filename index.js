const repoContext = require("./repository/repository-wrapper.js");

const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, function (){
  console.log("Server started. Listening on port 3000.");
});

app.get("/api/movies", (req, res) => {
  let movies = repoContext.movies.findAllMovies();
  res.send(movies);
});

app.get("/api/movies/:id", (req, res) => {
  let id = req.params.id;
  let movie = repoContext.movies.findMovieById(id);
  res.send(movie);
});

app.post("/api/movies", (req, res) => {
  let newMovie = req.body;
  let addedMovie = repoContext.movies.createMovie(newMovie);
  res.send(addedMovie);
});