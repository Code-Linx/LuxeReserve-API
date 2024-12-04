const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });
const app = require("./app");

//READ DB URL FROM .env FILE
//SAVE INTO A VARIABLE
const dbURL = process.env.DATABASE_URL;

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("DB connection successful!");
  })
  .catch((err) => {
    console.error(`Mongoose connection error: ${err.message}`);
  });

// START SERVER
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
