const url = 'http://localhost:3000/movies'

const submitButton = document.querySelector('#submit-button')

//  funciton to get movies
function getMovies () {
    fetch (url) 
    .then (res => res.json())
    .then (data => console.log(data))
    // add call to function render
}  

function createMovie () {
    fetch (url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify( {
           title: 'title',
        //    put the innerText here
           watched: 'watched'
        })
    })
}








