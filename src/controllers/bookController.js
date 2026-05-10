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