const express = require("express");
const moviesController = require("../Controllers/moviesController");
const authController = require("../Controllers/authController");
const router = express.Router();

//router.param('id', moviesController.checkId)

router
  .route("/highest-rated")
  .get(moviesController.getHighestRated, moviesController.getAllMovies);

router.route("/movie-stats").get(moviesController.getMovieStats);
router.route("/movie-genre/:genre").get(moviesController.getMovieByGenre);

router
  .route("/")
  .get(moviesController.getAllMovies)
  .post(
    authController.protect,
    authController.restrict("admin"),
    moviesController.createMovie
  );

router
  .route("/:id")
  .get(moviesController.getMovie)
  .patch(
    authController.protect,
    authController.restrict("admin"),
    moviesController.updateMovie
  )
  .delete(
    authController.protect,
    authController.restrict("admin"),
    moviesController.deleteMovie
  );

module.exports = router;
