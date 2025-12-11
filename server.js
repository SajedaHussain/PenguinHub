// imports
const express = require("express") //importing express package
const app = express() // creates a express application
require("dotenv").config() // allows us to use the .env variables
const mongoose = require("mongoose") // importing mongoose
const morgan = require("morgan")
const methodOverride = require("method-override")






// Middleware
app.use(express.static('public')); //all static files are in the public folder
app.use(express.urlencoded({ extended: false })); // this will allow us to see the data being sent in the POST or PUT
app.use(methodOverride("_method")); // Changes the method based on the ?_method
app.use(morgan("dev")) // logs the requests as they are sent to our sever in the terminal




async function conntectToDB(){ //connection to the database
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to Database")
    }
    catch(error){
        console.log("Error Occured",error)
    }
}




conntectToDB() // connect to database








// Routes go here


















app.listen(3000,()=>{
    console.log('App is running on port 3000')
}) // app will be waiting for requests on port 3000




