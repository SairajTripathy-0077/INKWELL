const Book = require('../models/book');

exports.createBook = async(req , res) => {
    try {
        req.body.user = req.user.id;
        const newBook = await Book.create(req.body);
        // 201 is the standard HTTP status code for "Created"
        res.status(201).json({
            success: true,
            data: newBook
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAllBook = async(req, res) => {
    try {
        const books = await Book.find(req.query);

        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        res.status(500).json({
            succcess: false,
            message: 'server error'
        });
    }
};

exports.getBook = async(req,res) => {
    try {
        const book = await Book.findById(req.params.id);

        if(!book){
            return res.status(404).json({
                success: false,
                message: 'book not found'
            });
        }
        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.updateBook = async(req,res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body , {
            new: true,
            runValidators: true // Ensures that the updated data adheres to the schema's validation rules
        });

        if(!book){
            return res.status(404).json({
                success: false,
                message: 'book not found'
            });
        }
        res.status(200).json({ success: true, data: book });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message
        });
    }
}

exports.deleteBook = async (req,res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if(!book){
            return res.status(404).json({
                success: false,
                message: 'book not found'
            });
        }
        res.status(200).json({ success: true, message: 'Book deleted successfully', data: book});
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message
        });
    }
}

exports.getInsight = async(req, res) => {
    try {
        //pipeline 1: calculate total books and avg rating
        const stats = await Book.aggregate([
            {
                $group: {
                    _id: null, // We use null because we want to group EVERYTHING together
                    totalBooks: { $sum: 1 }, // Add 1 for every document found
                    averageRating: { $avg: "$rating" } // Calculate the average of the 'rating' field
                }
            }
        ]);
        //pipeline 2: Find most read genre
        const popularGenre = await Book.aggregate([
            {
                $group: {
                    _id: "$genre",
                    count: {$sum: 1}
                }
            },
            {$sort : {count: -1}},
            {$limit: 1}
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalBooks: stats.length > 0 ? stats[0].totalBooks : 0, // If stats is empty, we return 0
                averageRating: stats.length > 0 ? Math.round(stats[0].averageRating *10)/10 : 0,
                topGenre: popularGenre.length > 0 ? popularGenre[0]._id : "None"

            }
        });
    } catch (error) {
        console.error("🔍 INSIGHTS ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}