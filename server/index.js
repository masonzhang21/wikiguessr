
var express = require('express');
var cors = require('cors');
const fetch = require("node-fetch");
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
var app = express(); //create express app
app.use(cors());
app.use(express.json());

var error = "";



//instead of post, do something with regex to get url and find appropriate category from that?
app.post('/random', (req, res) => {
    //console.log(req.body);
    var article = getRandomArticle();
    article.then(r => res.json(r));
});

app.listen(5000, function () {
    console.log('Listening on http://localhost:5000');
});

//returns article in json format
function getRandomArticleTitle() {
    var RANDOM_URL = 'https://en.wikipedia.org/api/rest_v1/page/random/title';
    var articleTitle = fetch(RANDOM_URL, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => res.json())
        .then(function (res) {
            return res.items[0].title;
        }).catch(console.log(error));
    return articleTitle;
}

async function getRandomArticle() {

    var articleTitle = await getRandomArticleTitle();
    console.log(articleTitle)
    var API_URL = 'https://www.wikipedia.org/w/api.php?action=parse&page=' + encodeURIComponent(articleTitle) + '&format=json';
    var article = fetch('https://www.wikipedia.org/w/api.php?action=parse&page=United_States&format=json', {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => res.json())
        .then(function (res) {
            var html = res.parse.text["\*"];
            return {
                articleTitle: articleTitle,
                html: html
            }
           // return formatArticle(articleTitle, html);f
        }).catch(console.log(error));
        return article;
}




