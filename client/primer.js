/*Since the backend is hosted on Google App Engine and that takes 10-15 seconds to "start up" upon first request, 
here we're making a dummy call to the backend server so it is "warmed up" by the time the user starts playing the game */

const API_URL = 'https://wikiguess.appspot.com/article';
//const API_URL = 'http://localhost:5000/article';
fetch(API_URL, {
    method: 'GET',
    headers: {
        'content-type': 'application/json'
    }
}).then(res => console.log("Pathway Activated")).catch("oops");
