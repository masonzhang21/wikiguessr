const express = require('express');
const cors = require('cors');
const fetch = require("node-fetch");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let app = express(); 
app.use(cors());
app.use(express.json());

const error = "Error";
const PORT = process.env.PORT || 5000;


function getArticle(articleTitle) {
    //articleTitle = "Anion_exchange_protein_2";

    let API_URL = 'https://www.wikipedia.org/w/api.php?action=parse&page=' + encodeURIComponent(articleTitle) + '&format=json';
    let article = fetch(API_URL, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => res.json())
        .then(function (res) {
            if (res.error == undefined)
                return true;
            else{
            return articleTitle;
        }
        }).catch(console.log(""));
    return article;
}
/*
(async function tester(){
    let result = [];
    for (titl of input){
        let works = await getArticle(titl);
        result.push(works);
    }
    console.log(result.filter(x => (x != true)).toString());
})()
*/