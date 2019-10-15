const API_URL = 'http://localhost:5000/random';

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
        // res is article!
        populatePage(res);
    }).catch("oops");

function populatePage(res){
    createInputFields(JSON.parse(res).title);

}

function createInputFields(title){
    console.log(title);
    for (let i = 0; i < title.length; i++) {
        var currentChar = title.charAt(i);
        if (currentChar == "a"){

        }
    }
    //convert words: remove accent marks, ignore case, etc
    //if not(word or number) then fill it in, else create input box
    

}