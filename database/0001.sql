-- Create reviews table
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    review_text TEXT NOT NULL,
    review_rating INTEGER NOT NULL CHECK (review_rating BETWEEN 1 AND 5),
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    inv_id INTEGER REFERENCES inventory(inv_id) ON DELETE CASCADE,
    account_id INTEGER REFERENCES account(account_id) ON DELETE CASCADE
);