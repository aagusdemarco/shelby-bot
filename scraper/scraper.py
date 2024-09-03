import bs4
import requests
import sqlite3

# Scrape the quotes from the web
page = requests.get("https://sarahscoop.com/the-best-100-quotes-from-peaky-blinders/")
soup = bs4.BeautifulSoup(page.text, "html.parser")
quotes = soup.findAll("p")

# Create the database containing the quotes
connection = sqlite3.connect("shelby-quotes.db")
cursor = connection.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS peaky_blinders (quotes TEXT)")

# Format the scraped data into a list of tuples
data = []
for i in range(1, 100):
    quote = quotes[i].text
    quote = quote[3:]
    quote = (quote.lstrip(),)
    data.append(quote)

# Insert the data into the database
cursor.executemany("INSERT INTO peaky_blinders (quotes) VALUES (?)", data)

# Save changes
connection.commit()
connection.close()
