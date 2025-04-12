// Access the tokens from the .env file
require("dotenv").config({ path: __dirname + "/.env" });

// Configure all the necessary packages
const { twitterClient } = require("./twitterClient.js");
const sqlite3 = require('sqlite3').verbose();

// Connect to the database
let db = new sqlite3.Database('./scraper/shelby-quotes.db');

// Initialize database with a 'posted' column if it doesn't exist
const initializeDatabase = () => {
	return new Promise((resolve, reject) => {
		// Check if posted column exists
		db.get("PRAGMA table_info(peaky_blinders)", (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			
			// Add posted column if it doesn't exist
			db.run(`ALTER TABLE peaky_blinders ADD COLUMN posted INTEGER DEFAULT 0`, (err) => {
				// Ignore error if column already exists
				resolve();
			});
		});
	});
};

// Get a non-repeated quote
const getNonRepeatedQuote = () => {
	return new Promise((resolve, reject) => {
		// Check if all quotes have been posted
		db.get("SELECT COUNT(*) as count FROM peaky_blinders WHERE posted = 0", (err, row) => {
			if (err) {
				reject(err);
				return;
			}

			// If all quotes have been posted, reset all to unposted
			if (row.count === 0) {
				db.run("UPDATE peaky_blinders SET posted = 0", (err) => {
					if (err) {
						reject(err);
						return;
					}
					
					// Continue with getting a quote after reset
					getRandomQuote();
				});
			} else {
				// If there are unposted quotes, get one
				getRandomQuote();
			}
		});
		
		// Function to get a random unposted quote
		function getRandomQuote() {
			const query = "SELECT rowid, quotes FROM peaky_blinders WHERE posted = 0 ORDER BY RANDOM() LIMIT 1";
			db.get(query, (err, row) => {
				if (err) {
					reject(err);
				} else if (row) {
					// Mark the quote as posted
					db.run("UPDATE peaky_blinders SET posted = 1 WHERE rowid = ?", [row.rowid], (err) => {
						if (err) {
							reject(err);
							return;
						}
						resolve(row.quotes);
					});
				} else {
					reject("No quote found");
				}
			});
		}
	});
};

// Tweet function that consumes the Twitter API
const tweet = async (quote) => {
	try {
		await twitterClient.v2.tweet(quote);
	} catch (e) {
		console.log(e)
	}
}

// Function that handles the GET quote and turn it into POST
const postQuote = async () => {
	try {
		// Initialize database if needed
		await initializeDatabase();
		// Get a non-repeated quote
		const quote = await getNonRepeatedQuote();
		await tweet(quote);
	} catch (e) {
		console.log(e)
	}
};

// Call the postQuote function
postQuote().then(() => {
	// Close database connection properly when all operations are done
	db.close((err) => {
		if (err) {
			console.error(err.message);
		}
		console.log('Database connection closed.');
	});
});
