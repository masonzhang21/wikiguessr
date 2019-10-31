//script for automatically moving between inputs upon entering/backspacing characters

var container = document.getElementById("input-container");

//if character is entered, move to next input
container.oninput = function (e) {
    var target = e.srcElement || e.target;
    var maxLength = parseInt(target.attributes["maxlength"].value, 10);
    var myLength = target.value.length;
    if (target.nextElementSibling != null && myLength >= maxLength) {
        while (target.nextElementSibling != null && target.nextElementSibling.readOnly) {
            target = target.nextElementSibling;
        }
        if (target.nextElementSibling != null)
            target.nextElementSibling.focus();
    }
}

//if backspace or delete is pressed, move to previous input.
container.onkeydown = function (e) {
    var target1 = e.srcElement || e.target;
    var myLength1 = target1.value.length;
    var key = e.keyCode || e.charCode;
    if (key == 32) {
        console.log("space");
        e.preventDefault();
    }
    if (key == 8 || key == 46) {
        if (myLength1 == 0 && target1.previousElementSibling != null) {
            while (target1.previousElementSibling != null && target1.previousElementSibling.readOnly) {
                target1 = target1.previousElementSibling;
            }
            target1.previousElementSibling.focus();
        }

    }
}


