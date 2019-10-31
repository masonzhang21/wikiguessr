var form = document.getElementById("input-form");
var next = document.getElementById("next-button");



function nextArticle(){
    location.reload();
}

form.onsubmit = function (event) {

    event.preventDefault();

    
    $('#input-button').prop('disabled', true);
    var guess = getGuess();
    $('#hint-box').remove();
    $('#match').css('visibility', 'visible').hide().fadeIn(1000);

    if (guess.toLowerCase() == window.master.title.toLowerCase()) {
        correctGuess();
    }
    else {
        incorrectGuess();
    }

    $('#input-button').remove();
    $('#next-button').fadeIn(800);

    $('body').keypress(function(event){
        if (event.keyCode == 13){
            nextArticle();
        }
    })
    loadFullArticle(master.blueprint);

};

function getGuess() {
    var guess = "";
    var charList = form.elements;
    console.log(charList.length)
    for (var i = 0; i < charList.length; i++) {
        if (charList[i].className == "guess-input") {
            guess = guess.concat(charList[i].value);
        }
    }
    return guess;

}

function correctGuess() {
    $("#match").text("✔");
    $("#match").addClass("correct");
    $('match').fadeIn(1000);
    $('#next-button').css('border', 'green 4px solid')
    $('.guess-input').prop('readonly', true)


}

function incorrectGuess() {
    $("#match").text("X");
    $("#match").addClass("incorrect");
    $('#next-button').css('border', 'red 4px solid')

    var title = window.master.title.toLowerCase();

    $('.guess-input').each(function(index){
        if ($(this).val().toLowerCase() != title.charAt(index)){
            $(this).fadeOut(1000, function(){
                var correctChar = $(this).val(title.charAt(index));
                correctChar.prop('readonly', true);
                correctChar.hide();
                $(this).replaceWith(correctChar);
                correctChar.fadeIn(2000);
            });
        }
        else{
            $(this).prop('readonly', true);
        }
    })
    
        

}


function loadFullArticle(){
    window.go = false;
    window.hintsRequired = false;
    var blueprint = master.blueprint;
    var introButton = document.getElementById("sb0");
    if (introButton != null)
        displayIntro(introButton);
    
    var sectionList = Object.keys(blueprint);
    for (var i = 1; i < sectionList.length; i++){
        var sectionButton = document.getElementById("sb" + i.toString());
        if (!($("#s" + i.toString()).length) && sectionButton.getAttribute("onclick") == "displayManager(this)"){
            //the element doesn't exist
            displayManager(sectionButton);
        }
        else{
            var overviewButton = document.getElementById("ssb" + i.toString() + "0");
            if (overviewButton != null)
                displaySectionOverview(overviewButton);

            var subsectionList = Object.keys(blueprint[sectionList[i]]);
            for (var j = 1; j < subsectionList.length; j++){
                var subsectionButton = document.getElementById("ssb" + i.toString() + j.toString());
                if (!($("#ss" + i.toString() + j.toString()).length)){
                    //the element doesn't exist
                    displayManager(subsectionButton);
                }
            }
        }
    }
    
}