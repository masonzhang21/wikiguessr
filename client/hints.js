
var go = true;
var numHints = 3;
var hintsRequired = true;

function scrollToAnchor(id) {
    var aTag = $(id);
    $('html,body').animate({ scrollTop: aTag.offset().top }, 'slow');
}

//for use with hidden text
function apparateText() {
    var paragraph = document.getElementsByClassName("second-hint");
    Array.prototype.forEach.call(paragraph, function (ele) {
        ele.classList.add("normal-text");
        ele.classList.remove("hidden-text");
    });
}

function updateHints() {
    var hintBox = $("#hint-count");

    switch (window.numHints) {
        case 3:
            hintBox.attr("count", "3");
            hintBox.html("hints: <br> 3");

            break;
        case 2:
            hintBox.attr("count", "2")
            hintBox.html("hints: <br> 2");

            break;
        case 1:
            hintBox.attr("count", "1")
            hintBox.html("hints: <br> 1");

            break;
        case 0:
            hintBox.attr("count", "0")
            hintBox.html("hints: <br> 0");
            numHints--;
            break;
        case -1:
            $('html,body').animate({ scrollTop: $("body").offset().top }, 'fast');
                        $("#hint-box").effect("shake");
            $("#hint-box").effect("bounce");

    }
}

function displayManager(button) {
    if (numHints > 0 || !hintsRequired) {
        var id = button.getAttribute("id");
        var intro = /^sb0$/
        var section = /^sb\d\d?$/
        var overview = /^ssb\d0$/
        var subsection = /^ssb\d\d\d?$/
        if (id.match(intro))
            displayIntro(button);
        else if (id.match(section))
            displaySection(button);
        else if (id.match(overview))
            displaySectionOverview(button);
        else if (id.match(subsection))
            displaySubsection(button);
        else
            throw "Something went really wrong :("

        numHints--;
    }
    if (hintsRequired)
        updateHints();
}

function commonCore(button, id) {
    //makes future clicks link to subsection
    $(button).attr('onclick', "scrollToAnchor('" + id + "')")
    //sets color of button
    button.style.background = '#808080';
    //go to location now
    if (window.go)
        scrollToAnchor(id);
}

function displayIntro(button) {
    var intro = master.blueprint.content;
    var introWithoutFirst = {};

    for (var i = 1; i < Object.keys(intro).length; i++)
        introWithoutFirst[i - 1] = intro[i];

    var wrappedIntro = { content: introWithoutFirst }

    appendParagraphs(wrappedIntro, 0, "#intro")
    commonCore(button, "body");
}

function displaySectionOverview(button) {
    var sectionTitle = button.parentElement.parentElement.getAttribute('section');
    let sectionLoc = Object.keys(master.blueprint).indexOf(sectionTitle).toString();
    let sectionId = "#s" + sectionLoc;
    let sectionUnit = window.master.blueprint[sectionTitle].content;
    let wrappedSectionUnit = { content: sectionUnit };

    if (!($(sectionId).length)) {
        //if section doesn't already exist, create section
        createSection(sectionTitle);
    }

    var sectionButton = button.parentElement.parentElement.firstElementChild;
    //if not done so already, splits outer button
    if (!(sectionButton.classList.contains('split-button'))) {
        splitButton(sectionButton, sectionId);
    }

    appendParagraphs(wrappedSectionUnit, 1, sectionId);
    commonCore(button, sectionId);
}
function displaySection(button) {
    var sectionTitle = button.innerText;
    let sectionLoc = Object.keys(master.blueprint).indexOf(sectionTitle).toString();
    let sectionId = "#s" + sectionLoc;
    let sectionUnit = window.master.blueprint[sectionTitle]

    if (!($(sectionId).length)) {
        //if section doesn't already exist, create section
        createSection(sectionTitle);
    }

    appendParagraphs(sectionUnit, 1, sectionId);
    commonCore(button, sectionId);
}

function displaySubsection(button) {
    var sectionTitle = button.parentElement.parentElement.getAttribute("section");
    let sectionLoc = Object.keys(master.blueprint).indexOf(sectionTitle).toString();
    let sectionId = "#s" + sectionLoc;
    var sectionButton = button.parentElement.parentElement.firstElementChild;
    var subsectionTitle = button.innerText;
    let subsectionLoc = Object.keys(master.blueprint[sectionTitle]).indexOf(subsectionTitle).toString();
    let subsectionId = "#ss" + sectionLoc + subsectionLoc;
    var subsectionUnit = window.master.blueprint[sectionTitle][subsectionTitle];

    if (!($(sectionId).length)) {
        //if section doesn't already exist, create section
        createSection(sectionTitle);
    }

    //creates subsection header
    var subsectionHeader = document.createElement('h3');
    subsectionHeader.innerText = subsectionTitle;
    setAttributes(subsectionHeader, {
        class: "subsection",
        id: "ss" + sectionLoc + subsectionLoc
    });
    //append subsection header to section
    $(sectionId).append(subsectionHeader);

    //if not done so already, splits outer button
    if (!(sectionButton.classList.contains('split-button'))) {
        splitButton(sectionButton, sectionId);
    }

    appendParagraphs(subsectionUnit, 2, sectionId);
    commonCore(button, subsectionId);
}


function createSection(sectionTitle) {
    let sectionLoc = Object.keys(master.blueprint).indexOf(sectionTitle).toString();
    let sectionContainer = document.createElement('div');
    setAttributes(sectionContainer, {
        id: "s" + sectionLoc
    })
    let sectionEle = document.createElement('h2');
    sectionEle.innerText = sectionTitle;
    setAttributes(sectionEle, {
        class: "section-title",
    });
    let sectionLine = document.createElement('hr');
    setAttributes(sectionLine, {
        class: "section-line"
    });
    $(sectionContainer).append(sectionEle);
    $(sectionContainer).append(sectionLine);
    $("#section-containers").append(sectionContainer);
}

function appendParagraphs(unit, level, sectionId) {
    //a unit is an object containing {content, (unit), (unit...)}
    for (let i = 0; i < Object.keys(unit.content).length; i++) {
        var par = unit.content[i];
        var censoredPar = titleRemover(par, master.title);
        var parEle = document.createElement('p');
        parEle.classList.add('fadein');
        parEle.innerHTML = censoredPar;
        $(parEle).hide();
        $(sectionId).append(parEle);
    }
    fadeIn();

    for (let i = 1; i < Object.keys(unit).length; i++) {
        //this for loop processes h4's and below
        var currentHeader = Object.keys(unit)[i];
        var headerType = "";
        switch (level) {
            case 1:
                headerType = "h3";
                break;
            case 2:
                headerType = "h4";
                break;
            case 3:
                headerType = "h5";
                break;
            default:
                throw "Something bad happened";
        }

        var headerEle = document.createElement(headerType);
        headerEle.innerText = currentHeader;
        $(sectionId).append(headerEle);
        console.log("hi")
        appendParagraphs(unit[currentHeader], level + 1, sectionId);
    }
}

function fadeIn() {
    var p = $(".fadein");
    $(p).removeClass('fadein');

    (function oneParagraph(i) {
        if (p.length <= i)
            return;
        var cur = p.eq(i);
        cur.fadeIn(3000, oneParagraph(i + 1))
    })(0);

}
function scrollingLoad() {
    var p = $(".fadein");
    $(p).removeClass('fadein');

    (function oneParagraph(i) {

        if (p.length <= i)
            return;
        var cur = p.eq(i),
            words = cur.text().split(/\s/g),
            span = $("<span>"),
            before = document.createTextNode("");
        console.log(words)
        cur.empty().show().append(before, span);
        (function oneWord(j) {
            if (j < words.length) {
                span.hide().text(words[j]).fadeIn(10, function () {
                    span.empty();
                    before.data += words[j] + " ";
                    oneWord(j + 1);
                });
            } else {
                span.remove();
                before.data = words.join(" ");
                setTimeout(function () {
                    oneParagraph(i + 1);
                }, 500);
            }
        })(0);
    })(0);
}

function splitButton(sectionButton, sectionId) {
    //if we haven't split the buttons, sectionButton becomes the right (dropdown) button
    //if we've already split the buttons, sectionButton is the left (text) button
    sectionButton.classList.add('dropdown-toggle-split');
    var splitButton = document.createElement('button');
    setAttributes(splitButton, {
        class: "btn btn-primary section-button split-button",
        onclick: "scrollToAnchor('" + sectionId + "')"
    })
    splitButton.innerText = sectionButton.innerText;
    sectionButton.innerText = "";
    $(sectionButton).before(splitButton);
}