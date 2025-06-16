const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { checkJWTToken } = require('../utilities/auth-middleware');

router.post('/add', 
    checkJWTToken, 
    reviewController.addReview
);

module.exports = router;