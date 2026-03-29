const express = require('express');
const router = express.Router();
const { generateOutline, generateChapterContent } = require('../controller/aiController');
const {protect} = require('../middlewares/authMiddleware');

router.use(protect); // Apply protect middleware to all routes in this router

router.post('/generate-outline', generateOutline);
router.post('/generate-chapter-content', generateChapterContent);

module.exports = router;