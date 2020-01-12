let form = document.getElementById("input-form");

function nextArticle() {
    gamestateGuess = true;
    numHints = 3;

    $('#input-button').prop('disabled', false);
    $('#match').removeClass("incorrect correct").removeAttr("style").addClass('hide').text("");
    $('#next-button').removeAttr("style").addClass("disappear");
    $('#loading').removeClass("disappear");
    $('#hint-box').text("3").attr("count", "3").removeClass("disappear");
    $("#input-container").empty();
    $("#intro").empty();
    $("#toc-buttons").empty();
    $("#section-containers").empty();

    if (typeof futureArticle !== "undefined" && futureArticle !== null) {
        populatePage(futureArticle);
    }
    else {
        $("#toc").addClass("hide");
        $("#loading").removeAttr("disappear");
        let ellipses = setInterval(function () {
            let text = $('#dots').text();
            if ($("#loading").hasClass("disappear")){
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
    $('#match').removeClass("hide").css('visibility', 'visible').hide().fadeIn(1000);
    $('#hint-box').addClass("disappear");
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
    $("#match").html("&#10004;");
    $("#match").addClass("correct");
    $('#next-button').css('color', 'green')
    $('.guess-input').prop('readonly', true)
}

function incorrectGuess() {
    $("#match").text("X");
    $("#match").addClass("incorrect");
    $('#next-button').css('color', 'red')

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
    let titleWords = title.replace(/[^A-Za-z\s]/ig, '').split(" ").filter(x => x != "");
    console.log(titleWords)

    for (ele of paragraphList) {
        let placeholders = $(ele).children('pre');
        for (placeholder of placeholders) {
            let censoredWord = placeholder.innerText;
            let actualWord = titleWords[parseInt(censoredWord) - 1];
            $(placeholder).replaceWith(actualWord);
        }
    }
}