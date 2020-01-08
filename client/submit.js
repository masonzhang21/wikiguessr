let form = document.getElementById("input-form");

function nextArticle() {
    gamestateGuess = true;
    numHints = 3;

    $('#input-button').prop('disabled', false);
    $('#match').removeClass("incorrect correct");
    $('#match').css('visibility', 'hidden');
    $('#match').text("");
    $('#next-button').css("display", "none");
    $('#hint-box').text("3")
    $("#hint-box").attr("count", "3")

    $("#input-container").empty();
    $("#intro").empty();
    $("#toc-buttons").empty();
    $("#section-containers").empty();

    if (typeof futureArticle !== "undefined" && futureArticle !== null) {
        populatePage(futureArticle);
    }
    else {
        $("#toc").addClass("hide");
        $("#loading").css("display", "initial");
        let ellipses = setInterval(function () {
            let text = $('#dots').text();
            if ($("#loading").css("display") == "none"){
                clearInterval(ellipses);
            }
            else if (text.length < 3) {
                $('#dots').text(text + ".");
            }
            else {
                $('#dots').text("");
            }
        }, 200);

        fetchArticle().then((package) => { populatePage(package) });
    }
}



form.onsubmit = function (event) {
    event.preventDefault();

    let guess = getGuess();
    if (guess.toLowerCase() == title.toLowerCase()) 
        correctGuess();
    else 
        incorrectGuess();

    gamestateGuess = false;
    $('#input-button').prop('disabled', true);
    $('#match').css('visibility', 'visible').hide().fadeIn(1000);
    $('#hint-box').addClass("hide");
    $('#input-button').addClass("hide");
    $('#next-button').fadeIn(800);

    $('body').keypress(function (event) {
        if (event.keyCode == 13 && !gamestateGuess) 
            nextArticle();
    })
    
    titleInserter();
    loadFullArticle(blueprint);
};

function getGuess() {
    let guess = "";
    let charList = form.elements;
    for (let i = 0; i < charList.length; i++) {
        if (charList[i].className == "guess-input") {
            guess = guess.concat(charList[i].value);
        }
    }
    return guess;
}

function correctGuess() {
    $("#match").text("✔");
    $("#match").addClass("correct");
    $('#next-button').css('border', 'green 4px solid')
    $('.guess-input').prop('readonly', true)
}

function incorrectGuess() {
    $("#match").text("X");
    $("#match").addClass("incorrect");
    $('#next-button').css('border', 'red 4px solid')

    $('.guess-input').each(function (index) {
        if ($(this).val().toLowerCase() != title.toLowerCase().charAt(index)) {
            $(this).fadeOut(1000, function () {
                let correctChar = $(this).val(title.toLowerCase().charAt(index));
                correctChar.prop('readonly', true);
                correctChar.hide();
                $(this).replaceWith(correctChar);
                correctChar.fadeIn(2000);
            });
        }
        else {
            $(this).prop('readonly', true);
        }
    })
}


function loadFullArticle() {

    //inserts titles in initial clue
    titleInserter($("#intro"));

    let introButton = document.getElementById("sb0");
    if (introButton != null && introButton.getAttribute("onclick") == "displayManager(this)")
        displayIntro(introButton);

    let sectionList = Object.keys(blueprint);
    for (let i = 1; i < sectionList.length; i++) {
        let sectionButton = document.getElementById("sb" + i.toString());
        if (!($("#s" + i.toString()).length) && sectionButton.getAttribute("onclick") == "displayManager(this)") {
            //the section doesn't exist and it is a section with no subsections
            displayManager(sectionButton);
        }
        else if ($("#s" + i.toString()).length && sectionButton.getAttribute("onclick") == "scrollToAnchor('#s" + i.toString() + "')") {
            //the section does exist and it is a section with no subsections
            titleInserter($("#s" + i.toString()));
        }
        else {
            //the section has subsections
            let subsectionList = Object.keys(blueprint[sectionList[i]]);
            for (let j = 0; j < subsectionList.length; j++) {
                let subsectionButton = document.getElementById("ssb" + i.toString() + j.toString());
                if (subsectionButton != null) {
                    if (!($("#ss" + i.toString() + j.toString()).length)) {
                        //the subsection doesn't exist
                        displayManager(subsectionButton);
                    }
                    else {
                        //the subsection does exist
                        titleInserter($("#ss" + i.toString() + j.toString()));
                    }
                }
            }
        }
    }
}

function titleInserter(container) {
    paragraphList = $(container).children('p');
    let titleWords = title.replace(/[\\(\\)\\.\,]/ig, '').split(" ");

    for (ele of paragraphList) {
        let placeholders = $(ele).children('pre');
        for (placeholder of placeholders) {
            let censoredWord = placeholder.innerText;
            $(placeholder).replaceWith(titleWords[parseInt(censoredWord) - 1]);
        }
    }
}