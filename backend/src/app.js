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
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);

//insights route
const { getInsight } = require('../src/controllers/bookController');
app.get('/insights', getInsight);

// health check
app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Inkwell API is online' });
});

//global error handler
app.use((err, req, res,next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong on our end!' });
});

// --- 5. START THE SERVER ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 API is running and listening on port ${PORT}`);
});




