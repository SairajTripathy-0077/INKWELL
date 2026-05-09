const express = require('express');
const router = express.Router();

const {createBook, getAllBook} = require('../controllers/bookController');

router.route('/')
    .post(createBook)
    .get(getAllBook);

module.exports = router;