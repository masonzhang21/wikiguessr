
var express = require('express');
var cors = require('cors');
const fetch = require("node-fetch");
var error = "";
var app = express(); //create express app
app.use(cors());
app.use(express.json());



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
    var article = fetch(API_URL, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => res.json())
        .then(function (res) {
            var text = res.parse.text["\*"];
            return formatArticle(articleTitle, text);
        }).catch(console.log(error));
        return article;
}

function formatArticle(articleTitle, text){
    var firstSentence = "This is a sentence.";
    var firstParagraph = "My first paragraph is very long";
    var article = {title: articleTitle, 
        firstSentence: firstSentence, 
        firstParagraph: firstParagraph,
        html: "html"};
    return JSON.stringify(article);
}
//title, first sentence, first paragraph, full body of article, css, censored version
