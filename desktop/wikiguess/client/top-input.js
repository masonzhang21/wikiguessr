//script for automatically moving between inputs upon entering a character

//if character is entered, move to next input
var container = document.getElementsByClassName("guess-container")[0];
container.oninput = function (e) {
    var target = e.srcElement || e.target;
    var maxLength = parseInt(target.attributes["maxlength"].value, 10);
    var myLength = target.value.length;
    if (myLength >= maxLength) {
        target.nextElementSibling.focus();
    }
}

//if backspace or delete is pressed, move to previous input. if enter is pressed, do stuff
container.onkeydown = function (e) {
    var target1 = e.srcElement || e.target;
    var myLength1 = target1.value.length;
    var key = e.keyCode || e.charCode;
    if (key == 8 || key == 46) {
        if (myLength1 == 0 && target1.previousElementSibling != null) {
            target1.previousElementSibling.focus();
        }
    }
    else if (key == 13){
        enter();
    }

function enter(){
    console.log("enter");
}



}