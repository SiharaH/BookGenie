const express = require('express');
const router = express.Router();
const { createBook, getBooks, getBookById, updateBook, deleteBook, updateBookCover } = require('../controller/bookController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.use(protect); // Apply protect middleware to all routes in this router

router.route('/cover/:id').put(upload, updateBookCover);
router.route('/').post(createBook).get(getBooks);
router.route('/:id').get(getBookById).put(updateBook).delete(deleteBook);


module.exports = router;