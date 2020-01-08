//script for automatically moving between inputs upon entering/backspacing characters

let container = document.getElementById("input-container");

//if character is entered, move to next input
container.oninput = function (e) {
    let target = e.srcElement || e.target;
    let maxLength = parseInt(target.attributes["maxlength"].value, 10);
    let myLength = target.value.length;
    if (target.nextElementSibling != null && myLength >= maxLength) {
        while (target.nextElementSibling != null && target.nextElementSibling.readOnly) {
            target = target.nextElementSibling;
        }
        if (target.nextElementSibling != null)
            target.nextElementSibling.focus();
    }
}

//if backspace or delete is pressed, move to previous input
container.onkeydown = function (e) {
    let target1 = e.srcElement || e.target;
    let myLength1 = target1.value.length;
    let key = e.keyCode || e.charCode;
    if (key == 32) {
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

$("#toc").on("click", function(){
    $("#input-container").children().each(function(){
        if ($(this).prop('readonly') == false && $(this).val() == ""){
            $(this).focus();
            return false;
        }
    });    
})

$(window).on("resize", function(){
    if (($('.overflow')[0].scrollWidth > $('.overflow')[0].offsetWidth)){
        $("#responsive-gap").addClass("col-1");
    }
    if (($('.overflow')[0].scrollWidth <= $('.overflow')[0].offsetWidth)){
        $("#responsive-gap").removeClass("col-1");
    }

})




