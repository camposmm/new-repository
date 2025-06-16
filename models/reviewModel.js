const pool = require('../database/');

const reviewModel = {
    async addReview(review_text, review_rating, inv_id, account_id) {
        const sql = `INSERT INTO reviews 
            (review_text, review_rating, inv_id, account_id) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *`;
        return await pool.query(sql, [review_text, review_rating, inv_id, account_id]);
    },

    async getReviewsByInventoryId(inv_id) {
        const sql = `SELECT r.*, a.account_firstname, a.account_lastname 
                     FROM reviews r 
                     JOIN account a ON r.account_id = a.account_id 
                     WHERE inv_id = $1 
                     ORDER BY review_date DESC`;
        return await pool.query(sql, [inv_id]);
    }
};

module.exports = reviewModel;