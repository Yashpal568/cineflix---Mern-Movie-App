const Movie = require("../Models/movieModel");
const Apifeatures = require("../Utils/ApiFeatures");
const asyncErrorHandler = require('../Utils/aysncErrorHandler')
const CustomError = require('../Utils/CustomError')

exports.debugAllMovies = async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
};

exports.getHighestRated = async (req, res, next) => {
  try {
    const movies = await Movie.find().sort("-ratings").limit(5);

    res.status(200).json({
      status: "success",
      quantity: movies.length,
      data: { movies },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Get all movies
/*
exports.getAllMovies = async (req, res) => {
  try {

    const features = new Apifeatures(Movie.find(), req.query)


    // 1. Convert query params to MongoDB operators
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const queryObj = JSON.parse(queryStr);

    // 2. Build query
    let query = Movie.find(queryObj);
    let query1 = Movie.find();

    // 3. Sorting (Mongoose 8 still supports this)
    if (req.query.sort) {
      query = query1.sort(req.query.sort.split(",").join(" "));
    } else {
      query = query.sort("-createdAt");
    }

    // LIMITING FIELDS
    if(req.query.fields){
     //query.select('name duration price ')4
     const fields = req.query.fields.split(',').join(' ');
     //console.log(fields);
    query = query.select(fields);
    } else{
      query =  query.select('-__v');
    }

    //PAGINATION
    const page = req.query.page*1 || 1;
    const limit = req.query.limit*1 || 10;
    // PAGE 1: 1 - 10; PAGE 2: 11 - 20; PAGE 3; 21 - 30;
    const skip = (page -1) * limit;
    query = query.skip(skip).limit(limit);

    if(req.query.page) {
      const movieCount = await Movie.countDocuments();
      if(skip>=movieCount){
        throw new Error('This page is not found');
      }
    }

    // 4. Execute query 
    const movies = await query;

    // 5. Send response
    res.status(200).json({
      status: "success",
      length: movies.length,
      data: {
        movies,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
}; */
exports.getAllMovies = asyncErrorHandler ( async (req, res, next) => {

    const features = new Apifeatures(Movie.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const movies = await features.query;

    res.status(200).json({
      status: "success",
      results: movies.length,
      data: { movies },
    });

});

// Get a single movie by ID
exports.getMovie = asyncErrorHandler (async (req, res, next) => {

    //const movie = await Movie.find({_id: req.params.id});
    const movie = await Movie.findById(req.params.id);

    if(!movie) {
      const error = new CustomError('Movie with that ID is not found!', 404);
      return next(error);
    }

    res.status(200).json({
      status: "success",
      data: {
        movie,
      },
    });
 
  });


// Create a new movie
exports.createMovie = asyncErrorHandler(async (req, res, next) => {

    const movie = await Movie.create(req.body);

    res.status(201).json({
      status: "Success",
      data: {
        movie,
      }
    });

});

// Update a movie
exports.updateMovie = async (req, res, next) => {
  try {
    const updateMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

     if(!updateMovie) {
      const error = new CustomError('Movie with that ID is not found!', 404);
      return next(error);
    }

    res.status(200).json({
      status: "success",
      data: {
        updateMovie,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Delete a movie
exports.deleteMovie =asyncErrorHandler (async (req, res) => {

    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

     if(!deletedMovie) {
      const error = new CustomError('Movie with that ID is not found!', 404);
      return next(error);
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.getMovieStats = asyncErrorHandler (async (req, res, next) => {

    const stats = await Movie.aggregate([
      { $match: { ratings: { $gte: 4.5 } } },
      {
        $group: {
          _id: "$releaseYear",
          avgRating: { $avg: "$ratings" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          priceTotal: { $sum: "$price" },
          movieCount: { $sum: 1 },
        },
      },
      { $sort: { minPrice: 1 } },
      // { $match: { maxPrice: { $gte: 60 } } },
    ]);

    res.status(200).json({
      status: "success",
      count: stats.length,
      data: { stats },
    });

  });

exports.getMovieByGenre =asyncErrorHandler (async (req, res, next) => {

    const genre = req.params.genre;
    const movies = await Movie.aggregate([
      { $unwind: "$genres" },
      {
        $group: {
          _id: "$genres",
          movieCount: { $sum: 1 },
          movies: { $push: "$name" },
        },
      },
      { $addFields: { genre: "$_id" } },
      { $project: { _id: 0 } },
      { $sort: { movieCount: -1 } },
      //{$limit: 6}
      { $match: { genre: genre } },
    ]);

    res.status(200).json({
      status: "success",
      count: movies.length,
      data: { movies },
    });

});
