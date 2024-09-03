// Access the tokens from the .env file
require("dotenv").config({ path: __dirname + "/.env" });

// Configure all the necessary packages
const { twitterClient } = require("./twitterClient.js");
const sqlite3 = require('sqlite3').verbose();
const CronJob = require("cron").CronJob;
const express = require('express')

// Initialize express
const app = express()
const port = process.env.PORT || 4000;

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

// CronJob that automates the tweets 2 times a day
const cronTweet = new CronJob("0 8,20 * * *", async () => {
  try {
    await postQuote();
  } catch (e) {
    console.log(e);
  }
});

// Call the Cron function
cronTweet.start();

// Configure express app
app.get('/', (req, res) => {
	res.send('Cron is running');
});

// Route to fetch random quote
app.get('/quote', async (req, res) => {
	try {
		const quote = await getQuote();
		res.send(quote);
	} catch (e) {
		res.status(500).send(e)
	}
});

// Manually post tweet from app
app.post('/tweet', async (req, res) => {
	try {
		const quote = await getQuote();
		await tweet(quote);
		res.send('tweeted: ' + quote);
	} catch (e) {
		res.status(500).send(e);
	}
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
