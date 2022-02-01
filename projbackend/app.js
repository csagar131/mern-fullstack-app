require('dotenv').config();
const mongoose =require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();


// Db connection
mongoose.connect(process.env.DATABASE,
        { useNewUrlParser: true },
        { useUnifiedTopology : true},
        { useCreateIndex : true}
        ).then(() => {
            console.log("DB CONNECTED")
        }).catch(() => {
            console.log("SOMETHING UNUSUAL HAPPENED")
        })

// MiddleWare
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());


// Routes
app.use("/api", require("./routes/auth"))
app.use("/api", require("./routes/user"))
app.use("/api", require("./routes/category"))

const port = process.env.PORT;
app.listen(port, () => {  console.log(`app is running at ${port}`)});