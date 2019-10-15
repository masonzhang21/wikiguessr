const API_URL = 'http://localhost:5000/random';

//json that's sent to backend
var info = {
    'category': 'random',
    'difficulty': 'hard',
    'other': 4
}

//post request
fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(info),
    headers: {
        'content-type': 'application/json'
    }
}).then(res => res.json())
    .then(function (res) {
        // res is object containing article title and article html!
        articleBlueprint = createArticleBlueprint(res.articleTitle, res.html);
    }).catch("oops");



// Parses HTML and creates a Hashmap 
function createArticleBlueprint(articleTitle, html){
    var firstSentence = "This is a sentence.";
    var firstParagraph = "My first paragraph is very long";
    var article = {
        title: articleTitle, 
        firstSentence: firstSentence, 
        blueprint: blueprint,
        html: html
    };
    //return JSON.stringify(article);
    //var styleCode = [];
    //var articleBlueprint =;
    // var tableCodeList = [];
    // var tocCode;
    // var infoboxCode;
    // var imageList = [];
    // var linksList = [];
    /*var content = {
        title: "Intro", 
        content: "Food is any substance[1] consumed to provide nutritional support for an organism.",
         sub1: {
            title: "Food sources",
            content: "Most food has its origin in plants.",
            sub1: {
                title: "Plants",
                content: "Many plants and plant parts..."
            },
            sub2: {
                title: "Animals",
                content: "Animals are used as food either"
            }
        
         },
         sub2: {
            title: "classifications and types of food",
            content: "",

         }
        
    }*/
    var blueprint = {
        content: {}
    }

    var blueprintLocation = 0;
    var counter = 0;
    var dummyDOM = document.createElement('template');
    dummyDOM.innerHTML = html;    
    currentElement = dummyDOM.content.firstElementChild.firstElementChild;
    console.log(currentElement);
    while (currentElement.nextElementSibling != null){

        switch(currentElement.tagName.toLowerCase()){

            case "p":
                if(currentElement.classList.length == 0 && currentElement.querySelector("#coordinates") == null){
                    var p = document.createElement("p");
                    p.innerHTML = currentElement.innerText;
                    addToBlueprint(p);
                }
                break;
            case "ul":
                //need to clean entire list, placeholder for now
                addToBlueprint(currentElement);
            case "h2":
                headerName = currentElement.innerText;
                blueprint[headerName] = {
                    content: {}
                };
                blueprintLocation = 1;
                counter = 0;
                break;
            case "h3":
                subheaderName = currentElement.innerText;
                headerName = Object.keys(blueprint)[Object.keys(blueprint).length - 1];
                blueprint[headerName][subheaderName] = {
                    content: {}
                };
                blueprintLocation = 2;
                counter = 0;
                break;
            case "h4":
                subsubheaderName = currentElement.innerText;
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
       
    function addToBlueprint(content){
        switch(blueprintLocation){
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
                console.log(Object.keys(blueprint[headerName]))
                console.log((Object.keys(blueprint[headerName]).length) - 1)

                console.log(headerName + " " + subheaderName)
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

    console.log(JSON.stringify(blueprint, null, 4));
}
//title, first sentence, first paragraph, full body of article, css, censored version

function populatePage(res){
    createInputFields(JSON.parse(res).title);

}

function createInputFields(title){
    console.log(title);
    for (let i = 0; i < title.length; i++) {
        var currentChar = title.charAt(i);
        if (currentChar == "a"){

        }
    }
    //convert words: remove accent marks, ignore case, etc
    //if not(word or number) then fill it in, else create input box
    

}