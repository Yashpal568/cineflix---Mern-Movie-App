const dotenv = require("dotenv");
const mongoose = require("mongoose");


process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught Excetion occured! Shutting down....');
   process.exit(1)

})


const app = require("./app");

// Load env variables
dotenv.config({ path: "./config.env" });

// Debug (optional)
console.log("Environment:", process.env.NODE_ENV);
console.log("MongoDB Connection String:", process.env.CONN_STR);

// Connect to MongoDB
const dbURI = process.env.NODE_ENV === "development" ? process.env.LOCAL_CONS_STR : process.env.CONN_STR;
console.log(`Connecting to database...`);
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ DB Connection Successful");
  });
 

// Start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection occured! Shutting down....');
  server.close(() => {
   process.exit(1)
  })

})



