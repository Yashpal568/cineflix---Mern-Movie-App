const mongoose = require("mongoose");
const fs = require('fs');
const validator = require('validator');


//creting schema

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required field"],
    unique: true,
    minLength: [4, "Movie name must have at least 4 character"],
    maxLength: [100, "Movie name must not have more than 100 characters"],
    trim: true,
    //validate: [validator.isAlpha, "Name should only contain allphabates."]
  },
  description: String,
  duration: {
    type: Number,
    required: [true, "Duration is required field"],
    unique: true,
    trim: true
  },
  ratings: {
    type: Number,
    validate: {
      validator: function(value) {
      return value >= 1 && value <= 10;
    },
    message: "Ratings ({VALUE}) should be above 1 and below 10"
    }
  },
  totalRating: {
    type: Number
  },
  releaseYear: {
    type: Number,
    required: [true, "Release Year is required field"]
  },
  releaseDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  genres: {
    type: [String],
    required: [true, 'Genres is required field'],
   // enum: {
    // values: ["Action", "Adventure", "Sci-Fi", "Thriller", "Crime", "Drama", "Comedy", "Romance", "Biography"],
    // message: "This genre does not exist"
    //}
  },
  directors: {
    type: [String],
    required: [true, 'Directors is required field']
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image is required field']
  },
  actors: {
    type: [String],
    required: [true, 'actors is required field']
  },
  price: {
    type: Number,
    require: [true, 'Price is required field']
  },
  createdBy: String
 
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

movieSchema.virtual('durationInHours').get(function () {
  return this.duration / 60;
})


// EXECUTE BEFORE THE DOCUMENT IS SAVED IN DB
//. savee() or .create()
// insertMany, findByIdAndUpdate will not work
movieSchema.pre('save', function(next) { 
  this.createdBy = 'YASHPAL';
  next();
})

movieSchema.post('save', function (doc, next) {
  const content = `A new movie document with name ${doc.name} has been created by ${doc.createdBy}\n`;

  fs.writeFile('./Log/log.txt', content, { flag: 'a' }, (err) => {
    if (err) console.error(err.message);
  });

  next();
});

movieSchema.pre(/^find/, function(next) {
  // Only apply the filter if releaseDate field exists
   this.find({
    $or: [
      { releaseDate: { $lte: Date.now() } },
      { releaseDate: { $exists: false } },
      { releaseDate: null }
    ]
  });

  // Track query start time
  this.startTime = Date.now();
  next();
});

movieSchema.post(/^find/, function(docs, next) {
  // Track query end time
  this.endTime = Date.now();

  const content = `Query took ${this.endTime - this.startTime} milliseconds to fetch ${docs.length} documents.\n`;

  fs.appendFile("./Log/log.txt", content, (err) => {
    if (err) console.error(err.message);
  });

  next();
});

movieSchema.pre('aggregate', function(next) {
  console.log(this.pipeline().unshift({ $match: {releaseDate: {$lte: new Date()}}}));
  next();
})


const Movie = mongoose.model("Movie", movieSchema);




module.exports = Movie;