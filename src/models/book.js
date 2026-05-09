const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'A book must have a title'], 
        trim: true // Removes accidental white spaces like "  Harry Potter  " -> "Harry Potter"
    },
    author: { 
        type: String, 
        required: [true, 'An author is required'], 
        trim: true 
    },
    genre: { 
        type: String, 
        required: [true, 'Genre is required'],
        lowercase: true // Standardizes all genres (e.g., "FICTION" becomes "fiction")
    },
    rating: { 
        type: Number, 
        min: [1, 'Rating cannot be below 1'], 
        max: [5, 'Rating cannot be above 5'], 
        default: null 
    },
    status: { 
        type: String, 
        enum: ['Plan to Read', 'Reading', 'Finished'], // The data MUST be one of these exact strings
        default: 'Plan to Read' 
    },
    review: { 
        type: String, 
        maxLength: [500, 'Review cannot exceed 500 characters'], 
        trim: true 
    }
}, {
    timestamps: true // Industrial Standard: Automatically adds 'createdAt' and 'updatedAt' fields
});