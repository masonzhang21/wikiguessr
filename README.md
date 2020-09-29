# wikiguessr
A Wikipedia-based trivia game: try to guess words based on their Wikipedia article. Makes use of the MediaWiki API with a Node.js backend for retrieving random articles.

# How To Play
Choose one of the ten preset categories to get appropriately themed words, or pick random to learn about some super obscure people you've never heard of and never will!

Each round, you start with the first paragraph of the intro section. You get three additional hints—each hint unlocks an additional section or subsection of the article. Just click on the one you want in the table of contents.

Type your guess in the top bar. All non-alphabetical characters are given to you, and the guess checker isn't case sensitive. Whether your answer is right or wrong, the full Wikipedia article will load, in case you want to read more about whatever intriguing subject you were on. 

Bewarned: the preset categories are mostly safe, but if you're playing on random, certain articles may be too much for Wikiguessr. If an article is loading for more than 10s, give the page a quick refresh. 

# The Guts

This whole thing runs on boatloads of Javascript. The front-end sends a fetch request to a server somewhere in Iowa for an article blueprint. That server pulls data from a MongoDB database (if you're playing a category) or the MediaWiki API (if you're on random), formats it nicely in an article blueprint—a formulaic layout/map of the chosen Wikipedia article—and hands it over to the front-end. Then, we replace the words in the article title with blanks and initialize the page with words and buttons. When an enter is detected, the input in the top bar is submitted and checked. The correct answer is displayed if wrong and the full article is loaded using lots of Javascript and JQuery. If another enter is detected, the game resets and the next word is chosen.

The static website is hosted with Google Cloud Bucket, the backend server with Google App Engine, and the database with MongoDB Atlas.

# Bugs

Sadly there might be a couple of these. If you find one, let me know at mason_zhang@brown.edu!
