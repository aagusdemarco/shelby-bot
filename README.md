# SHELBY BOT 
#### Video Demo:
#### Description:

**Shelby Bot** is a Twitter bot that automatically posts quotes from the TV show *Peaky Blinders* twice a day. This bot is built using Node.js and Python and leverages the Twitter API v2 for posting tweets. It also uses SQLite3 as its database to store the quotes and GitHub Actions to automate the tweet scheduling process. 

The primary purpose of this project is to scrape quotes from a specific website, store them in a database, and automatically tweet them at specified intervals using a scheduled job. The bot is configured to tweet at 8:00 AM and 4:00 PM GMT-3 every day.

Simple yet powerful, this automation tool combines web scraping, data management, and social media automation in a compact project. It demonstrates how different programming languages and tools can work together to create a cohesive and automated solution for posting content on social media.

## Project Structure

### `index.js`
This is the main script for the bot written in JavaScript using Node.js. It handles fetching a random quote from the SQLite3 database and posting it to Twitter using the Twitter API v2. The script utilizes several libraries and configurations:

1. **dotenv**: Used to load environment variables from a `.env` file, which contains the API keys and tokens required for authentication with the Twitter API.
   
2. **sqlite3**: A lightweight database engine used to store and retrieve quotes. The `index.js` script opens a connection to the database (`shelby-quotes.db`) located in the `scraper` directory and fetches a random quote using SQL commands.

3. **twitterClient.js**: A custom module that wraps the Twitter API client. It provides the functionality needed to interact with Twitter, such as posting tweets.

4. **getQuote()**: A function that retrieves a random quote from the SQLite3 database. It performs a SQL query to select a random quote from the table `peaky_blinders` and returns it as a promise.

5. **tweet()**: A function that uses the Twitter API to post the retrieved quote. It handles exceptions and logs errors in case of any failure.

6. **postQuote()**: A function that integrates both `getQuote()` and `tweet()` functions to fetch a quote and post it on Twitter.

### `scraper/scraper.py`
This Python script scrapes quotes from the web and populates the SQLite3 database. It utilizes the following libraries:

1. **BeautifulSoup (bs4)**: Used for parsing HTML and scraping content from the website that contains quotes from *Peaky Blinders*. It finds all paragraph elements (`<p>`) on the webpage to extract the quotes.

2. **Requests**: A popular Python library for sending HTTP requests. It is used to fetch the webpage containing the quotes.

3. **SQLite3**: Python's built-in library for managing SQLite databases. It is used to create a database (`shelby-quotes.db`) and insert the scraped quotes into a table named `peaky_blinders`.

The scraper script first fetches the quotes from the website, cleans and formats them, and then inserts them into the database. The use of SQLite3 ensures that the database is lightweight and easy to set up.

### `twitterClient.js`
This file contains the configuration and setup for the Twitter client using the Twitter API v2. It manages the connection and authentication to the Twitter API, providing methods to post tweets programmatically.

### `package.json` and `package-lock.json`
These files manage the Node.js dependencies required for the project. They specify the necessary libraries, their versions, and the scripts to run the bot.

### GitHub Actions (`.github/workflows/bot.yml`)
The project uses GitHub Actions for continuous integration and automation. The workflow is defined in the `bot.yml` file, which is set up to run the bot twice a day at 8:00 AM and 4:00 PM GMT-3. It follows these steps:

1. **Check Out Repository**: Clones the repository into the GitHub Actions runner.

2. **Setup Node.js**: Installs the specific version of Node.js required for the project.

3. **Install Dependencies**: Installs the Node.js dependencies defined in `package.json`.

4. **Set Environment Variables**: Configures the environment variables needed to run the bot, using secrets stored in GitHub.

5. **Run Twitter Bot**: Executes the `index.js` script to fetch a random quote and tweet it.

### `.env` (Not included in the repository for security reasons)
This file contains environment variables such as API keys and tokens for authenticating with the Twitter API. It is required to run the bot locally and its functionality is instead replaced by GitHub Repository Secrets, which allow the bot to work properly.

## Design Choices
The project involves a combination of Python and JavaScript to leverage the strengths of both languages. Python, with its robust libraries like BeautifulSoup and Requests, is ideal for web scraping tasks, while JavaScript with Node.js offers an efficient way to interact with the Twitter API.

We chose SQLite3 for the database because it is lightweight and serverless, which fits well with the simplicity and portability of this project. For deployment and automation, GitHub Actions was selected due to its seamless integration with GitHub and its powerful automation capabilities.
