
let gamestateGuess = true;
let numHints = 3;

function updateHints() {
    if (numHints == 0) {
        //if you try to use a hint and you have no more, shake hint box
        $('html,body').animate({ scrollTop: $("body").offset().top }, 'fast');
        $("#hint-box").effect("shake");
    }
    else {
        numHints--;
        $("#hint-box").attr("count", numHints.toString());
        $("#hint-box").html(numHints.toString());
    }
}

function displayManager(button) {
    if (numHints > 0 || !gamestateGuess) {
        let id = button.getAttribute("id");
        let intro = /^sb0$/
        let section = /^sb\d\d?$/
        let subsection = /^ssb\d\d\d?\d?$/
        if (id.match(intro))
            displayIntro(button);
        else if (id.match(section))
            displaySection(button);
        else if (id.match(subsection))
            displaySubsection(button);
        else
            throw "Something went really wrong :(";
    }
    if (gamestateGuess)
        updateHints();
}

function commonCore(button, id) {
    //makes future clicks link to subsection
    $(button).attr('onclick', "scrollToAnchor('" + id + "')")
    //adds clicked class to button
    $(button).addClass("clicked");
    //go to location now
    if (gamestateGuess)
        scrollToAnchor(id);
}

function displayIntro(button) {
    let intro = blueprint.content;
    let introWithoutFirstP = {};

    for (let i = 1; i < Object.keys(intro).length; i++)
        introWithoutFirstP[i - 1] = intro[i];

    let wrappedIntro = { content: introWithoutFirstP }

    appendParagraphs(wrappedIntro, 0, "#intro")
    commonCore(button, "body");
}

function displaySection(button) {
    let sectionTitle = button.innerText;
    let sectionLoc = Object.keys(blueprint).indexOf(sectionTitle).toString();
    let sectionId = "#s" + sectionLoc;
    let sectionUnit = blueprint[sectionTitle]

    if (!($(sectionId).length))
        createSection(sectionTitle);

    appendParagraphs(sectionUnit, 1, sectionId);
    commonCore(button, sectionId);
}


function displaySubsection(button) {
    let sectionTitle = button.parentElement.parentElement.getAttribute("section");
    let sectionLoc = Object.keys(blueprint).indexOf(sectionTitle).toString();
    let sectionId = "#s" + sectionLoc;
    let sectionButton = button.parentElement.parentElement.firstElementChild;
    let subsectionTitle = button.innerText;
    let subsectionLoc;
    let subsectionId;
    let subsectionUnit;

    //initializes certain variables differently if subsection is overview
    if (subsectionTitle == "overview") {
        subsectionLoc = "0";
        subsectionId = "#ss" + sectionLoc + "0";
        subsectionUnit = { content: blueprint[sectionTitle].content };
    }
    else {
        subsectionLoc = Object.keys(blueprint[sectionTitle]).indexOf(subsectionTitle).toString();
        subsectionId = "#ss" + sectionLoc + subsectionLoc;
        subsectionUnit = blueprint[sectionTitle][subsectionTitle];
    }

    if (!($(sectionId).length))
        createSection(sectionTitle);


    //creates subsection container
    let subsectionContainer = document.createElement('div');
    subsectionContainer.setAttribute("id", "ss" + sectionLoc + subsectionLoc);

    //creates subsection header
    let subsectionHeader = document.createElement('h3');
    subsectionHeader.innerText = subsectionTitle;
    subsectionHeader.setAttribute("class", "subsection");

    //append subsection header to subsection container
    $(subsectionContainer).append(subsectionHeader);

    //append subsection container to section in correct position
    let prevSubsection = null;
    let postSubsection = null;
    for (let i = 1; i < Object.keys(blueprint[sectionTitle]).length; i++) {
        if ($("#ss" + sectionLoc + i.toString()).length && i < parseInt(subsectionLoc))
            prevSubsection = "#ss" + sectionLoc + i.toString();
        else if ($("#ss" + sectionLoc + i.toString()).length && i > parseInt(subsectionLoc))
            postSubsection = "#ss" + sectionLoc + i.toString();
    }
    if (prevSubsection == null && postSubsection == null)
        $(sectionId).append(subsectionContainer);
    else if (prevSubsection == null)
        $(postSubsection).before(subsectionContainer);
    else
        $(prevSubsection).after(subsectionContainer);

    //if not done so already, splits outer button
    if (!(sectionButton.classList.contains('split-button'))) {
        splitButton(sectionButton, sectionId);
    }

    appendParagraphs(subsectionUnit, 2, subsectionId);
    commonCore(button, subsectionId);

    //changes button color
    $("#sb" + sectionLoc).addClass("clicked");
    let subsectionButtonDiv = button.parentElement;
    if ($(subsectionButtonDiv).has('button[onclick="displayManager(this)"]').length == 0) {
        $(sectionButton).addClass("clicked");
        $(subsectionButtonDiv).addClass("clicked");
    }
}


function createSection(sectionTitle) {
    let sectionLoc = Object.keys(blueprint).indexOf(sectionTitle);
    let sectionContainer = document.createElement('div');
    $(sectionContainer).attr("id", "s" + sectionLoc.toString());
    let sectionTitleContainer = document.createElement('div');
    $(sectionTitleContainer).attr("class", "section-title");
    let sectionEle = document.createElement('h2');
    sectionEle.innerText = sectionTitle;
    let sectionLine = document.createElement('hr');
    $(sectionLine).attr("class", "section-line");

    $(sectionTitleContainer).append(sectionEle);
    $(sectionTitleContainer).append(sectionLine);
    $(sectionContainer).append(sectionTitleContainer);

    //ensures sections are displayed in correct order
    let previousSection = null;
    let postSection = null;
    for (let i = 1; i < Object.keys(blueprint).length; i++) {
        if ($("#s" + i.toString()).length && i < sectionLoc)
            previousSection = "#s" + i.toString();
        else if ($("#s" + i.toString()).length && i > sectionLoc)
            postSection = "#s" + i.toString();
    }
    if (previousSection == null && postSection == null)
        $("#section-containers").append(sectionContainer);
    else if (previousSection == null)
        $(postSection).before(sectionContainer);
    else
        $(previousSection).after(sectionContainer);
}

function appendParagraphs(unit, level, sectionId) {
    //a unit is an object containing {content, (unit), (unit...)}
    for (let i = 0; i < Object.keys(unit.content).length; i++) {
        let par = unit.content[i];
        let censoredPar;
        if (gamestateGuess)
            censoredPar = titleRemover(par);
        else
            censoredPar = par;
        let parEle = document.createElement('p');
        parEle.classList.add('fadein');
        parEle.innerHTML = censoredPar;
        $(parEle).hide();
        $(sectionId).append(parEle);
    }
    fadeIn();

    // takes care of h4's and improbable/impossible edge cases
    for (let i = 1; i < Object.keys(unit).length; i++) {
        let currentHeader = Object.keys(unit)[i];
        let headerType;
        switch (level) {
            case 0:
                throw "Something bad happened";
            case 1:
                throw "Something bad happened";
            case 2:
                headerType = "h4";
                break;
            case 3:
                headerType = "h5";
                break;
            case 4:
                headerType = "h6";
                break;
            default:
                throw "Something bad happened";
        }

        let headerEle = document.createElement(headerType);
        headerEle.innerText = currentHeader;
        $(sectionId).append(headerEle);
        appendParagraphs(unit[currentHeader], level + 1, sectionId);
    }
}

function splitButton(sectionButton, sectionId) {
    // sectionButton becomes the right (dropdown) button
    sectionButton.classList.add('dropdown-toggle-split');
    let splitButton = document.createElement('button');
    setAttributes(splitButton, {
        class: "btn btn-primary section-button split-button",
        onclick: "scrollToAnchor('" + sectionId + "')"
    })
    splitButton.innerText = sectionButton.innerText;
    sectionButton.innerText = "";
    $(sectionButton).before(splitButton);
}

function fadeIn() {
    let p = $(".fadein");
    (function oneParagraph(i) {
        if (p.length <= i)
            return;
        let cur = p.eq(i);
        cur.fadeIn(3000, oneParagraph(i + 1))
    })(0);

    $(p).removeAttr('class style');
}

function scrollToAnchor(id) {
    let aTag = $(id);
    $('html,body').animate({ scrollTop: aTag.offset().top }, 'slow');
}

