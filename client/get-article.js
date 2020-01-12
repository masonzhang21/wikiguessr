let blueprint;
let title;
let futureArticle;

(function () {
    fetchArticle().then(package => populatePage(package));

    let ellipses = setInterval(function () {
        let text = $('#dots').text();
        if ($("#loading").hasClass("disappear"))
            clearInterval(ellipses);
        else if (text.length < 3) 
            $('#dots').text(text + ".");
        else 
            $('#dots').text("");
    }, 200);

})();

//get request to backend
function fetchArticle() {
    //const API_URL = 'http://localhost:5000/article';
    const API_URL = 'https://wikiguess.appspot.com/article';
    const category = window.location.pathname.replace(/.html|\/client\/|\//g, '').replace('/client/', '').replace('/', '');
    return fetch(API_URL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            category
        })
    }).then(res => res.json()).catch("Error");
}


function populatePage(package) {
    $(document).ready(function () {
        $("#toc, #top-container").removeClass("hide");
        //$(".disappear").removeClass("disappear");
        $("#loading").addClass("disappear");
        $("#input-container").children().each(function(){
            if ($(this).prop('readonly') == false){
                $(this).focus();
                return false;
            }
        });    
    });

    blueprint = package.blueprint;
    title = package.title;

    createInputForm();
    insertIntroParagraph(blueprint.content[0]);
    insertSectionButtons(Object.keys(blueprint));

    futureArticle = null;
    fetchArticle().then((package) => { futureArticle = package; });
    
}


function createInputForm() {
    let container = document.getElementById("input-container");

    for (let i = 0; i < title.length; i++) {
        let currentChar = title.charAt(i);
        let charField = document.createElement("input");
        charField = setAttributes(charField, {
            class: "guess-input",
            type: "text",
            size: "1"
        });

        if (currentChar.match(/^[a-zA-Z]+$/)) {
            charField = setAttributes(charField, {
                placeholder: "_",
                maxlength: "1",
            })
        }
        else {
            charField.setAttribute("value", currentChar);
            charField.readOnly = true;
        }
        container.appendChild(charField);
    }

    if (($('.overflow')[0].scrollWidth > $('.overflow')[0].offsetWidth)){
        $("#responsive-gap").addClass("col-1");
    }

    $("#input-container").children().each(function(){
        if ($(this).prop('readonly') == false){
            $(this).focus();
            return false;
        }
    });     
}
/**
 * Loads first paragraph into page
 * @param  {String} firstParagraph first paragraph text
 */
function insertIntroParagraph(firstParagraph) {
    let censoredFirstParagraph = titleRemover(firstParagraph);
    let introPar = document.createElement('p');
    introPar.innerHTML = censoredFirstParagraph;
    $("#intro").append(introPar);
}


function insertSectionButtons(sections) {
    for (let i = 0; i < sections.length; i++) {
        let section = sections[i];
        //outer button-group
        let container = document.createElement("div")
        setAttributes(container, {
            class: "btn-group",
            role: "group",
            section: section
        })
        //outer button
        let button = document.createElement("button");
        button.innerText = section;
        setAttributes(button, {
            type: "button",
            class: "btn btn-primary btn-lg section-button",
            id: "sb" + i.toString(),
        });

        let subsections = Object.keys(blueprint[section]);
        if (section == "content") {
            if (Object.keys(blueprint[section]).length > 1) {
                //only appends if there's more intro than the first paragraph
                button.innerText = "intro";
                $(button).attr("onclick", "displayManager(this)");
                $(container).append(button);
                $("#toc-buttons").append(container);
            }
        }

        else if (subsections.length == 1) {
            //if current section has no subsections, append button to container and add container to html
            $(button).attr("onclick", "displayManager(this)");
            $(container).append(button);
            $("#toc-buttons").append(container);

        }
        else if (subsections.length > 1) {
            //if current section has subsections, make nested button-group
            //make section button drop-down
            button.classList.add('dropdown-toggle');
            $(button).attr("data-toggle", "dropdown");
            //make div that holds subsections
            let dropdown = document.createElement("div");
            dropdown.setAttribute("class", "dropdown-menu");

            //if section has some content (overview)
            subsectionContent = blueprint[section]["content"];
            if (Object.keys(subsectionContent).length > 0) {
                let overviewSubsection = document.createElement('button');
                overviewSubsection.innerText = "overview";
                setAttributes(overviewSubsection, {
                    class: "dropdown-item subsection-button",
                    id: "ssb" + i.toString() + "0",
                    onclick: "displayManager(this)"
                })
                $(dropdown).append(overviewSubsection);
            }
            for (let j = 1; j < subsections.length; j++) {
                //make subsection button
                let subsection = document.createElement('button');
                subsection.innerText = subsections[j];
                setAttributes(subsection, {
                    class: "dropdown-item subsection-button",
                    id: "ssb" + i.toString() + j.toString(),
                    onclick: "displayManager(this)"

                })
                $(dropdown).append(subsection);
            }

            $(container).append(button);
            $(container).append(dropdown);
            $("#toc-buttons").append(container);
        }
    }
}


/**
 * Replaces all instances of titlewords in paragraph with underlines
 * @param  {String} paragraph The long string
 * @return {String}     The output string with all instances of titlewords replaced by underlines
 */
function titleRemover(paragraph) {
    let titleWords = title.replace(/[^A-Za-z\s]/ig, '').split(" ").filter(x => x != "");
    console.log(titleWords)
    for (let i = 0; i < titleWords.length; i++) {
        let titleWord = titleWords[i];
        let escapedTitleWord = titleWord.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        let spaces = " ".repeat(Math.round(titleWord.length / 2));
        //index of word in title 
        let wordNum = i + 1;
        spaces = "<pre><u>" + spaces + wordNum + spaces + "</u></pre>";
        let regex = RegExp(escapedTitleWord, "gi");
        paragraph = paragraph.replace(regex, spaces);
    }
    return paragraph;
}

function setAttributes(el, attrs) {
    for (let key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
    return el;
}

