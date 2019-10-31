
var express = require('express');
var cors = require('cors');
var natural = require('natural');
const fetch = require("node-fetch");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var app = express(); //create express app
app.use(cors());
app.use(express.json());

var error = "";

const PORT = process.env.PORT || 5000;

app.get('/', function (req, res) {
    res
    .status(200)
    .send('Hello, world!')
    .end();
});
//instead of post, do something with regex to get url and find appropriate category from that?
app.post('/random', (req, res) => {
    //console.log(req.body);
    var article = getRandomArticle();
    article.then(r => res.json(r));
});

app.listen(PORT, function () {
    console.log('Listening on port $(PORT)');
});

async function getRandomArticle(){
    var articleTitle = await getRandomArticleTitle()
    return getArticle(articleTitle);
}
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



async function getArticle(articleTitle) {
    //var articleTitle = "United_States";
    //var articleTitle = await getRandomArticleTitle();
    //console.log(articleTitle)
    var API_URL = 'https://www.wikipedia.org/w/api.php?action=parse&page=' + encodeURIComponent(articleTitle) + '&format=json';
    //var usa = "https://www.wikipedia.org/w/api.php?action=parse&page=United_States&format=json";
    var article = fetch(API_URL, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => res.json())
        .then(function (res) {
            var html = res.parse.text["\*"];
            var blueprint = createArticleBlueprint(html);
            //var firstParagraph = blueprint.content[0].textContent;
            //var firstSentence = getFirstSentence(firstParagraph);
            //printBlueprint(blueprint);
            return {
                title: articleTitle.replace(/_/g, " "),
                //firstSentence: firstSentence,
                blueprint: blueprint,
                //linkList: linkList
                //imageList: imgList
                
                html: html
            }
        }).catch(console.log(error));
    return article;
}

//TO-DO: Make this work somewhat reliably with RegEx
function getFirstSentence(paragraph) {
    var tokenizer = new natural.SentenceTokenizer();
    var sentenceList = tokenizer.tokenize(paragraph);
    //console.log(sentenceList);
    return sentenceList[0];
}

function createArticleBlueprint(html) {
    /* BLUEPRINT FORMAT:

    {
        content: {
            0: <p> text </p>,
            1: <p> text </p>,
            2: <p> text </p>
        },

        Etymology: {
            content: {
                0: <p> text </p>
                ...
            }
        },

        Demographics: {
            content: {

            },

            Population: {
                content: {0: text, ..., n : text}

                Major population areas: {
                    content: {0: text, ..., n : text}
                }
        
            }

            Language: {
                content: {0: text, ..., n : text}
            }

            Religion: {
                content: {0: text, ..., n : text}
            }

            Family structure: {
                content: {0: text, ..., n : text}
            }
        }
    }


    */
    /*TO-DO: ADD:
     var tableCodeList = [];
     var tocCode;
     var infoboxCode;
     var imageList = [];
     var linksList = [];
   */

    var blueprint = {
        content: {}
    }

    //tracks which hierarchial level we're currently on
    var blueprintLocation = 0;
    //tracks the number of paragraphs currently in the object we're on.
    var counter = 0;

    //creates the dummy dom we use to traverse the html
    var dom = new JSDOM(html);
    var dummyDOM = dom.window.document.getElementsByTagName("p")[0];

    //first element of code 
    currentElement = dummyDOM;
    while (currentElement.nextElementSibling != null) {
        switch (currentElement.tagName.toLowerCase()) {
            case "p":
                //there might be more 'exceptions' (when first classless <p> </p> is not first paragraph of intro), add to second part of if statement.
                if (currentElement.classList.length == 0 && currentElement.querySelector("#coordinates") == null) {
                    //var p = document.createElement("p");
                    //TO-DO: set innerHTML to filtered version, remove [1] reference annotations, [edit]s, keep certain tags (eg superscript)
                    //p.innerHTML = currentElement.textContent;
                    var p = breakTags(currentElement);
                    addToBlueprint(p);
                }
                break;
            case "ul":
                var ul = breakTags(currentElement);
                addToBlueprint(ul);
                break;
            case "h2":
                headerName = breakTags(currentElement);
                blueprint[headerName] = {
                    content: {}
                };
                blueprintLocation = 1;
                counter = 0;
                break;
            case "h3":
                subheaderName = breakTags(currentElement);
                headerName = Object.keys(blueprint)[Object.keys(blueprint).length - 1];
                blueprint[headerName][subheaderName] = {
                    content: {}
                };
                blueprintLocation = 2;
                counter = 0;
                break;
            case "h4":
                subsubheaderName = breakTags(currentElement);
                headerName = Object.keys(blueprint)[Object.keys(blueprint).length - 1];
                subheaderName = Object.keys(blueprint[headerName])[(Object.keys(blueprint[headerName]).length) - 1];
                blueprint[headerName][subheaderName][subsubheaderName] = {
                    content: {}
                };
                blueprintLocation = 3;
                counter = 0;
                break;
            default:

        }
        currentElement = currentElement.nextElementSibling;
    }

    function addToBlueprint(content) {
        //var content = element.outerHTML;
        switch (blueprintLocation) {
            case 0:
                //intro text
                blueprint.content[counter] = content;
                counter++;
                break;
            case 1:
                //header text (h2)
                headerName = Object.keys(blueprint)[Object.keys(blueprint).length - 1];
                blueprint[headerName].content[counter] = content;
                counter++;
                break;
            case 2:
                //subheader text (h3)
                headerName = Object.keys(blueprint)[Object.keys(blueprint).length - 1];
                subheaderName = Object.keys(blueprint[headerName])[(Object.keys(blueprint[headerName]).length) - 1];
                blueprint[headerName][subheaderName].content[counter] = content;
                counter++;
                break;
            case 3:
                headerName = Object.keys(blueprint)[Object.keys(blueprint).length - 1];
                subheaderName = Object.keys(blueprint[headerName])[(Object.keys(blueprint[headerName]).length) - 1];
                subsubheaderName = Object.keys(blueprint[headerName][subheaderName])[(Object.keys(blueprint[headerName][subheaderName]).length) - 1];
                blueprint[headerName][subheaderName][subsubheaderName].content[counter] = content;
                counter++;
                break;
        }
    }
    return filterSections(blueprint);
}

function filterSections(blueprint){
    var sections = Object.keys(blueprint);
    var banlist = ["See also", "Notes", "Further reading", "External links", "References", "Sources"]
    for (var i = 0; i < sections.length; i++){
        if (banlist.includes(sections[i])){
            delete blueprint[sections[i]];
        }
    }
    return blueprint;
}
/**
 * "Breaks" certain html tags while leaving others intact
 * @param  {Element} ele The element 
 * @return {String}     The output string containing certain desirable tags (superscript) while removing others (links, citations)
 */
function breakTags(ele){
    var htmlString = "";

    var nodes = ele.childNodes;
    for (var i = 0; i < nodes.length; i++){
        if(nodes[i].nodeType == 3){
            htmlString += nodes[i].textContent;
        }
        else if (nodes[i].nodeType == 1){
            //always break these elements
            var elementsToBreak = ["A", "B", "U", "I", "SPAN"];
            var elementsToKeep = ["UL", "LI"];
            var tag = nodes[i].tagName;
            if(tag == "SPAN" && nodes[i].classList.contains("mw-editsection") ||
                (tag == "SUP" && nodes[i].classList.length != 0)){
                //these are destroyed
            }
            else if(elementsToBreak.includes(tag.toUpperCase())){
                //the textContent of these are extracted
                htmlString += nodes[i].textContent;
            }
            else if (elementsToKeep.includes(tag.toUpperCase()) ||
            (tag == "SUP" && (nodes[i].classList.length == 0)) ||
            true){
                //the tags of these are preserved
                htmlString += ("<"+tag+">" +breakTags(nodes[i])+ "</"+tag+">");
            }
        }
    }

    if (ele.tagName == "UL"){
        htmlString = "<ul>" + htmlString + "</ul>";
    }
    return htmlString;
}

function printBlueprint(blueprint) {

    for (var i = 0; i < Object.keys(blueprint.content).length; i++) {
        console.log(blueprint.content[i]);
    }

    for (var i = 1; i < Object.keys(blueprint).length; i++) {
        currentHeader = Object.keys(blueprint)[i];
        console.log(currentHeader);
        printBlueprint(blueprint[currentHeader]);
    }
}


module.exports = app;

