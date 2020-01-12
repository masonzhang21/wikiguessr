
const express = require('express');
const cors = require('cors');
const fetch = require("node-fetch");
const jsdom = require("jsdom");
const MongoClient = require('mongodb').MongoClient;

const { JSDOM } = jsdom;
const app = express();
app.use(cors());
app.use(express.json());

const error = "Error";
const PORT = process.env.PORT || 5000;

app.get('/', ((req, res) => res.json("All systems online!")));
app.get('/article', ((req, res) => res.json("Pathways Activated!")));

app.post('/article', async function (req, res) {
    let category = req.body.category.replace(".html", "").replace("/", "");
    let articleTitle;
    if (category == "random")
        articleTitle = await getRandomArticleTitle();
    else
        articleTitle = await articleChooser(category);
    let article = getArticle(articleTitle);
    article.then(r => res.json(r)).catch(console.log(error));
});

app.listen(PORT, function () {
    console.log(`Listening to ${PORT}`);
});

function articleChooser(category) {
    return new Promise((resolve, reject) => {
        const url = "mongodb+srv://masonzhang21:Zmas3.14@wikiguessr-qhfmm.gcp.mongodb.net/test?retryWrites=true&w=majority";
        const client = new MongoClient(url, { useNewUrlParser: false });

        client.connect(function (err) {
            if (err) reject(err);
            const db = client.db("Wikiguesr");
            let cursor = db.collection('Categories').find({ category_name: category })
            cursor.next(function (err, doc) {
                if (err) reject(err);
                let articles = Object.keys(doc);
                articles.splice(0, 2);
                let chosenArticle = Math.floor(Math.random() * articles.length);
                resolve(articles[chosenArticle]);
            });
            client.close();
        });
    })
}

function getRandomArticleTitle() {
    const RANDOM_URL = 'https://en.wikipedia.org/api/rest_v1/page/random/title';
    let articleTitle = fetch(RANDOM_URL, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => res.json())
        .then(res => res.items[0].title)
        .catch(console.log(error));
    return articleTitle;
}

async function getArticle(articleTitle) {
    let API_URL = 'https://www.wikipedia.org/w/api.php?action=parse&page=' + encodeURIComponent(articleTitle) + '&format=json';
    let output = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => res.json()).catch(console.log(error));

    let html = output.parse.text["\*"];
    //stupid if statement to account for bad links (redirects) that can be removed when the database is formatted properly
    if (html.includes("\"redirectText\"")) {
        betterTitle = html.match(/(?<="\/wiki\/)(.*?)(?=")/)[0];
        return getArticle(betterTitle);
    }
    else {
        let blueprint = createArticleBlueprint(html);
        let package = {
            title: articleTitle.replace(/_/g, " "),
            blueprint: blueprint
        };
        return package;
    }
}

/* BLUEPRINT FORMAT:

1. a unit is an object containing a content object and more unit objects
2. a content object contains paragraphs
3. blueprint is a unit

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
    }
}*/

function createArticleBlueprint(html) {

    let blueprint = {
        content: {}
    }

    //tracks which hierarchial level we're currently on
    let blueprintLocation = 0;
    //tracks the number of paragraphs in the object we're currently on.
    let counter = 0;

    //creates the dummy dom we use to traverse the html
    let dom = new JSDOM(html);
    const firstElement = dom.window.document.querySelectorAll(".mw-parser-output > p")[0];

    //first element of code 
    let currentElement = firstElement;
    while (currentElement.nextElementSibling != null) {
        switch (currentElement.tagName.toLowerCase()) {
            case "p": {
                //'exceptions' when classless <p> is not a paragraph are added to if statement.
                if (currentElement.classList.length == 0 && currentElement.querySelector("#coordinates") == null) {
                    let p = breakTags(currentElement);
                    addToBlueprint(p);
                }
                break;
            }
            case "table": {
                if (currentElement.classList.contains("wikitable"))
                    addToBlueprint("<table>" + breakTags(currentElement) + "</table>");
                break;
            }
            case "ul": {
                let ul = breakTags(currentElement);
                addToBlueprint(ul);
                break;
            }
            case "h2": {
                let headerName = breakTags(currentElement);
                blueprint[headerName] = {
                    content: {}
                };

                blueprintLocation = 1;
                counter = 0;
                break;
            }
            case "h3": {
                let subheaderName = breakTags(currentElement);
                let headerName = Object.keys(blueprint)[Object.keys(blueprint).length - 1];
                blueprint[headerName][subheaderName] = {
                    content: {}
                };

                blueprintLocation = 2;
                counter = 0;
                break;
            }
            case "h4": {
                let subsubheaderName = breakTags(currentElement);
                let headerName = Object.keys(blueprint)[Object.keys(blueprint).length - 1];
                let subheaderName = Object.keys(blueprint[headerName])[(Object.keys(blueprint[headerName]).length) - 1];
                blueprint[headerName][subheaderName][subsubheaderName] = {
                    content: {}
                };
                blueprintLocation = 3;
                counter = 0;
                break;
            }
            default:
        }
        currentElement = currentElement.nextElementSibling;
    }

    function addToBlueprint(content) {
        switch (blueprintLocation) {
            case 0: {
                //intro text
                blueprint.content[counter] = content;
                counter++;
                break;
            }
            case 1: {
                //header text (h2)
                let headerName = Object.keys(blueprint)[Object.keys(blueprint).length - 1];
                blueprint[headerName].content[counter] = content;
                counter++;
            }
                break;
            case 2: {
                //subheader text (h3)
                let headerName = Object.keys(blueprint)[Object.keys(blueprint).length - 1];
                let subheaderName = Object.keys(blueprint[headerName])[(Object.keys(blueprint[headerName]).length) - 1];
                blueprint[headerName][subheaderName].content[counter] = content;
                counter++;
                break;
            }
            case 3: {
                //subsubheader text (h4)
                let headerName = Object.keys(blueprint)[Object.keys(blueprint).length - 1];
                let subheaderName = Object.keys(blueprint[headerName])[(Object.keys(blueprint[headerName]).length) - 1];
                let subsubheaderName = Object.keys(blueprint[headerName][subheaderName])[(Object.keys(blueprint[headerName][subheaderName]).length) - 1];
                blueprint[headerName][subheaderName][subsubheaderName].content[counter] = content;
                counter++;
                break;
            }
        }
    }
    return filterSections(blueprint);
}

function filterSections(blueprint) {
    const sections = Object.keys(blueprint);
    const banlist = ["see also", "notes", "further reading", "external links", "references", "sources", "bibliography", "notes and references"]
    for (let i = 0; i < sections.length; i++) {
        if (banlist.includes(sections[i].toLowerCase())) {
            delete blueprint[sections[i]];
        }
    }
    return blueprint;
}
/**
 * "Breaks" certain html tags while leaving others intact
 * @param  {Element} ele The element 
 * @return {String}     The output string containing text and certain desirable tags (superscript) while removing others (links, citations)
 */
function breakTags(ele) {
    let htmlString = "";

    let nodes = ele.childNodes;
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType == 3) {
            htmlString += nodes[i].textContent;
        }
        else if (nodes[i].nodeType == 1) {
            //always break these elements
            const elementsToBreak = ["A", "B", "U", "I", "SPAN", "SMALL"];
            let tag = nodes[i].tagName;
            if (tag == "SPAN" && nodes[i].classList.contains("mw-editsection") ||
                (tag == "SUP" && nodes[i].classList.length != 0)) {
                //these are destroyed
            }
            else if (elementsToBreak.includes(tag.toUpperCase())) {
                //the textContent of these are extracted
                htmlString += nodes[i].textContent;
            }
            else {
                //the tags of these are preserved
                htmlString += ("<" + tag + ">" + breakTags(nodes[i]) + "</" + tag + ">");
            }
        }
    }
    return htmlString;
}


function printBlueprint(blueprint) {

    for (let i = 0; i < Object.keys(blueprint.content).length; i++) {
        console.log(blueprint.content[i]);
    }

    for (let i = 1; i < Object.keys(blueprint).length; i++) {
        currentHeader = Object.keys(blueprint)[i];
        console.log(currentHeader);
        printBlueprint(blueprint[currentHeader]);
    }
}


module.exports = app;

