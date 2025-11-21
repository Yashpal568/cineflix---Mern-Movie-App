const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Movie = require('../Models/movieModel');


// Load env variables
dotenv.config({ path: "./config.env" });

// Connect to MongoDB
mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("✅ DB Connection Successful");
  })
  .catch((error) => {
    console.error("❌ DB Connection Error:", error.message);
  });

  // Read movies.json file
  const movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf-8'));


  // DELETE EXISTING MOVIE DOCUMENTS FROM COLLECTION
  const deleteMovie = async () => {
    try {
        await Movie.deleteMany();
        console.log('Data successfully deleted');
    } catch (err) {
        console.log(err.message);
    }
    process.exit();
  }

  // IMPORTING MOVIES DATA TO MONGODB COLLECTION

  const importMovie = async () => {
    try {
        await Movie.create(movies);
        console.log('Data successfully imported');
    } catch (err) {
        console.log(err.message);
    }
    process.exit();
  }

if(process.argv[2] === '--import') {
    importMovie();
} 
if(process.argv[2] === '--delete') {
    deleteMovie();
}