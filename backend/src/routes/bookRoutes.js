const express = require('express');
const router = express.Router();

const { 
    createBook, 
    getAllBook, 
    getBook, 
    updateBook, 
    deleteBook 
} = require('../controllers/bookController');

// 1. IMPORT YOUR SECURITY GUARD
// (Make sure this path matches where your auth middleware actually lives!)
const { protect } = require('../middleware/authMiddleware'); 

// 2. PUT THE GUARD IN FRONT OF YOUR ROUTES
router.route('/')
    .post(protect, createBook)    // <--- Added protect here!
    .get(protect, getAllBook);    // <--- Added protect here so users only see their own books!

router.route('/:id')
    .get(protect, getBook)
    .patch(protect, updateBook)
    .delete(protect, deleteBook);

module.exports = router;