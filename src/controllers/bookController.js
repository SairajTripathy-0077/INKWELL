const Book = require('../models/book');

exports.createBook = async(req , res) => {
    try {
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
        const books = await Book.find();

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