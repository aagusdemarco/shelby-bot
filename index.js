// Access the tokens from the .env file
require("dotenv").config({ path: __dirname + "/.env" });

// Configure all the necessary packages
const { twitterClient } = require("./twitterClient.js");
const sqlite3 = require('sqlite3').verbose();

// Query the databes for random quotes
let db = new sqlite3.Database('./scraper/shelby-quotes.db');
const getQuote = () => {
	return new Promise((resolve, reject) => {
		const query = "SELECT * FROM peaky_blinders ORDER BY RANDOM() LIMIT 1";
		db.get(query, (err, row) => {
			if (err) {
				reject(err);
			} else if (row) {
				resolve(row.quotes)
			} else {
				reject("no quote found")
			};
		});
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
		const quote = await getQuote();
		await tweet(quote);
	} catch (e) {
		console.log(e)
	}
};

// Call the postQuote function
postQuote();
