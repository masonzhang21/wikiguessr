const API_URL = 'https://wikiguess.appspot.com/random';

var master;


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
        // res is object containing article title, first sentence, blueprint, etc.
        populatePage(res);
    }).catch("oops");



function populatePage(master) {
    $(document).ready(function () {
        $(".hide").removeClass("hide")
    });
    //makes the backend package global
    this.master = master;
    createInputForm(master.title);
    insertIntroParagraph(master.blueprint.content[0], master.title);
    insertSectionButtons(Object.keys(master.blueprint));


}
/* 
<div class="btn-group" role="group"">
  <div class="btn-group" role="group">
    <button id="btnGroupDrop1" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" >
      Dropdown
    </button>
    <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
      <a class="dropdown-item" href="#">Dropdown link</a>
      <a class="dropdown-item" href="#">Dropdown link</a>
    </div>
  </div>

</div>
            </div>*/

function insertSectionButtons(sections) {
    for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        //outer button-group
        var container = document.createElement("div")
        setAttributes(container, {
            class: "btn-group",
            role: "group",
            section: section
        })
        //outer button
        var button = document.createElement("button");
        button.innerText = section;
        setAttributes(button, {
            type: "button",
            class: "btn btn-primary btn-lg section-button",
            id: "sb" + i.toString(),
            //onclick: "displaySection(this)"
        });

        var subSections = Object.keys(master.blueprint[section]);
        if (section == "content") {
            if (Object.keys(section).length > 1) {
                //only appends if there's more intro than the first paragraph
                button.innerText = "intro";
                $(button).attr("onclick", "displayManager(this)");
                $(container).append(button);
                $("#section-buttons").append(container);
            }
        }

        else if (subSections.length == 1) {
            //if current section has no subsections, append button to container and add container to html
            $(button).attr("onclick", "displayManager(this)");
            $(container).append(button);
            $("#section-buttons").append(container);

        }
        else if (subSections.length != 1) {
            //if current section has more subsections, make nested button-group
            //make section button drop-down
            button.classList.add('dropdown-toggle');
            $(button).attr("data-toggle", "dropdown");
            //make div that holds subsections
            var dropdown = document.createElement("div");
            setAttributes(dropdown, {
                class: "dropdown-menu",
            });

            //if section has some content
            subsectionCont = master.blueprint[section]["content"];
            if (Object.keys(subsectionCont).length > 0){
                var subSection = document.createElement('button');
                subSection.innerText = "overview";
                setAttributes(subSection, {
                    class: "dropdown-item subsection-button",
                    id: "ssb" + i.toString() + "0",
                    onclick: "displayManager(this)"
                    //section: section

                })
                $(dropdown).append(subSection);
            }
            for (var j = 1; j < subSections.length; j++) {
                //make subsection button
                var subSection = document.createElement('button');
                subSection.innerText = subSections[j];
                setAttributes(subSection, {
                    class: "dropdown-item subsection-button",
                    id: "ssb" + i.toString() + j.toString(),
                    //bss: button subsection
                    onclick: "displayManager(this)"
                    //section: section

                })
                $(dropdown).append(subSection);
            }

            var subcontainer = container;
            $(subcontainer).append(button);
            $(subcontainer).append(dropdown);
            $(container).append(subcontainer);
            $("#section-buttons").append(container);
        }
    }
}

/**
 * Loads first paragraph into page, unhidden
 * @param  {String} introString Paragraph element with all <p> tags and entire first intro paragraph
 * @param  {String} articleTitle Title of article
 */
function insertIntroParagraph(introString, articleTitle) {
    //firstParagraph = htmlToElement(introString).innerText;
    firstParagraph = introString;
    censoredFirstParagraph = titleRemover(firstParagraph, articleTitle);
    document.getElementById("first-hint").innerHTML = censoredFirstParagraph;
}

/**
 * Not used
 * @param  {String} str The long string
 */
function insertHiddenText(master) {
    for (var i = 0; i < Object.keys(master.blueprint.content).length; i++) {
        var paragraphString = master.blueprint.content[i];
        var paragraph = htmlToElement(paragraphString).innerText;
        var censoredParagraph = titleRemover(paragraph, master.title);
        var censoredParagraphEle = document.createElement("p");
        censoredParagraphEle.innerHTML = censoredParagraph;
        if (i == 0)
            document.getElementById("first-hint").innerHTML = censoredParagraph;
        else {
            setAttributes(censoredParagraphEle, {
                class: "hidden-text second-hint",
                onclick: "apparateText()"
            })
            //var parentEle = document.createElement("p");
            //parentEle.appendChild(censoredParagraphEle);
            document.getElementById("second-hint").appendChild(censoredParagraphEle);
        }


    }
}

/**
 * Replaces all instances of each word of title in str with underlines
 * @param  {String} str The long string
 * @param  {String} title The string to be tokenized, and each token removed from str
 * @return {String}     The output string with all instances all words in title replaced by underlines
 */
function titleRemover(str, title) {
    var titleWords = title.split(" ");
    var paragraph = str;
    for (var i = 0; i < titleWords.length; i++) {
        var keyword = titleWords[i];
        var escapedKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        //initialize underscores to half the underscores in the keyword
        var underscores = " ".repeat(Math.round(keyword.length / 2));
        //index of word in title with underscore
        var wordNum = i + 1;
        underscores = "<pre><u>" + underscores + wordNum + underscores + "</u></pre>";
        var regex = RegExp(escapedKeyword, "gi");
        paragraph = paragraph.replace(regex, underscores);
    }
    return paragraph;
}

function createInputForm(title) {
    console.log(title);
    var container = document.getElementById("input-container");
    flag = true;



    for (let i = 0; i < title.length; i++) {
        var currentChar = title.charAt(i);
        var charField = document.createElement("input");
        charField = setAttributes(charField, {
            class: "guess-input",
            type: "text",
            size: "1"
        });

        if (currentChar.match(/^[0-9a-zA-Z]+$/)) {
            charField = setAttributes(charField, {
                placeholder: "_",
                maxlength: "1"
            })
            if (flag) {
                charField.autofocus = true;
                flag = false;
            }
        }
        else {
            charField.setAttribute("value", currentChar);
            charField.readOnly = true;
        }
        container.appendChild(charField);
    }

    //sets font size based on title length
    var l = title.length;
    var fontSize;
    switch (true) {
        case l <= 5:
            fontSize = "fs-6";
            break;
        case l > 6 && l <= 10:
            fontSize = "fs-5";
            break;
        case l > 10 && l <= 15:
            fontSize = "fs-4";
            break;
        case l > 15 && l <= 31:
            fontSize = "fs-3";
            break;
        case l > 31:
            fontSize = "fs-2";
            break;
        default:
            break;
    }
    $('#input-form').addClass(fontSize);
}

function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
    return el;
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}


