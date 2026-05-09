const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('connected to mongodb 👌🏻'))
    .catch((err) => console.error('Database not connected 🤚🏻',err));

//routes
const bookRoutes = require('../src/routes/bookRoutes');
app.use('/books', bookRoutes);
//global error handler
app.use((err, req, res,next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong on our end!' });
});

module.exports = app;




