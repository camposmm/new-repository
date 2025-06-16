const reviewModel = require('../models/reviewModel');
const utilities = require('../utilities/');

const reviewController = {};

reviewController.addReview = async function(req, res) {
    const { review_text, review_rating, inv_id } = req.body;
    const account_id = res.locals.account.account_id;
    
    try {
        await reviewModel.addReview(review_text, review_rating, inv_id, account_id);
        req.flash("notice", "Review submitted successfully!");
        res.redirect(`/inv/detail/${inv_id}`);
    } catch (error) {
        req.flash("notice", "Error submitting review");
        console.error("Error adding review:", error);
        res.redirect(`/inv/detail/${inv_id}`);
    }
};

module.exports = reviewController;